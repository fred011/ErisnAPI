require("dotenv").config();
import { IncomingForm } from "formidable"; // For handling form data, especially file uploads
import { join } from "path"; // For working with file paths
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs"; // File system module
import { genSaltSync, hashSync, compareSync } from "bcryptjs"; // Corrected the typo here
import { sign } from "jsonwebtoken"; // For generating and verifying JSON Web Tokens

import School, { findOne, find } from "../Models/school.model.js"; // School model

export async function registerSchool(req, res) {
  try {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "Form Parsing Error" });

      const photo = files.image; // Expecting single image file
      if (!photo)
        return res
          .status(400)
          .json({ success: false, message: "Image is required" });

      const filepath = photo.filepath;
      const originalFilename = photo.originalFilename.replace(" ", "_");
      const newPath = join(
        __dirname,
        process.env.SCHOOL_IMAGE_PATH,
        originalFilename
      );

      const photoData = readFileSync(filepath);
      writeFileSync(newPath, photoData); // Save uploaded image to server

      // Encrypting Password
      const salt = genSaltSync(10);
      const hashPassword = hashSync(fields.password, salt);

      // Creating new School instance
      const newSchool = new School({
        school_name: fields.school_name,
        email: fields.email,
        admin: fields.admin,
        password: hashPassword,
      });

      const savedSchool = await newSchool.save();
      res.status(200).json({
        success: true,
        data: savedSchool,
        message: "School is Registered Successfully.",
      });
    });
  } catch (error) {
    console.error("Error registering school:", error);
    res
      .status(500)
      .json({ success: false, message: "School registration failed." });
  }
}
export async function loginSchool(req, res) {
  try {
    const school = await findOne({ email: req.body.email });
    if (!school) {
      return res
        .status(401)
        .json({ success: false, message: "Email is not registered." });
    }

    const isAuth = compareSync(req.body.password, school.password);
    if (!isAuth) {
      return res
        .status(401)
        .json({ success: false, message: "Password is Incorrect." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const token = sign(
      {
        id: school._id,
        admin: school.admin,
        school_name: school.school_name,
        role: "SCHOOL",
      },
      jwtSecret,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Successfully Logged In.",
      user: {
        id: school._id,
        admin: school.admin,
        school_name: school.school_name,
        role: "SCHOOL",
      },
    });
  } catch (error) {
    console.error("Error logging in school:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error [SCHOOL LOGIN].",
    });
  }
}
export async function getAllSchools(req, res) {
  try {
    const schools = await find().select("-password"); // Exclude sensitive fields
    res.status(200).json({
      success: true,
      message: "Successfully fetched all schools",
      schools,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error [SCHOOL DATA].",
    });
  }
}
export async function getSchoolOwnData(req, res) {
  try {
    const id = req.user.id;
    const school = await findOne({ _id: id }).select("-password");
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found.",
      });
    }
    res.status(200).json({
      success: true,
      school,
    });
  } catch (error) {
    console.error("Error fetching single school data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error [OWN SCHOOL DATA].",
    });
  }
}
export async function updateSchool(req, res) {
  try {
    const id = req.user.id;

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err)
        return res
          .status(400)
          .json({ success: false, message: "Form Parsing Error" });

      const school = await findOne(id);
      if (!school)
        return res
          .status(404)
          .json({ success: false, message: "School not found" });

      if (files.image) {
        const photo = files.image;
        const originalFilename = photo.originalFilename.replace(" ", "_");

        // Delete old image if it exists
        if (school.school_image) {
          const oldImagePath = join(
            __dirname,
            process.env.SCHOOL_IMAGE_PATH,
            school.school_image
          );
          if (existsSync(oldImagePath)) unlinkSync(oldImagePath);
        }

        // Save new image
        const newPath = join(
          __dirname,
          process.env.SCHOOL_IMAGE_PATH,
          originalFilename
        );
        const photoData = readFileSync(photo.filepath);
        writeFileSync(newPath, photoData);

        school.school_image = originalFilename; // Update school image
      }

      // Update fields
      Object.keys(fields).forEach((key) => {
        school[key] = fields[key];
      });

      await school.save();
      res.status(200).json({
        success: true,
        message: "School updated Successfully.",
        school,
      });
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ success: false, message: "School update failed." });
  }
}
