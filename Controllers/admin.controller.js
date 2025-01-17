import { genSalt, hash, compare } from "bcryptjs"; // For hashing passwords securely
import { isEmail } from "validator"; // For email validation
import Admin, { findOne } from "../Models/admin.model"; // Import the Admin model

export async function registerAdmin(req, res) {
  try {
    // Destructure incoming data from the request body
    const { name, email, password } = req.body;

    // Ensure all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    // Validate the email format
    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Check if an admin already exists in the database
    const existingAdmin = await findOne();
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin is already registered.", // Prevent multiple admins from being created
      });
    }

    // Hash the password for secure storage (using async methods)
    const salt = await genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await hash(password, salt); // Hash the password with the salt

    // Create a new admin instance with the provided data
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new admin to the database
    const savedAdmin = await newAdmin.save();

    // Send a successful response with the saved admin data
    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: savedAdmin,
    });
  } catch (error) {
    console.error("Error registering admin:", error.message); // Log the error message
    res.status(500).json({
      success: false,
      message: "Admin registration failed. Please try again later.",
    });
  }
}
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body; // Extract login credentials from the request
    const admin = await findOne(); // Fetch the only admin record

    // Check if the provided email matches the registered admin
    if (!admin || admin.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or admin not found.",
      });
    }

    // Verify the provided password against the hashed password
    const isAuth = await compare(password, admin.password); // Using async bcrypt.compare
    if (!isAuth) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate a JWT token with a validity of 1 hour
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: admin._id, role: "ADMIN" }, jwtSecret, {
      expiresIn: "1h",
    });

    // Respond with the token and admin details
    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
export async function getAdminData(req, res) {
  try {
    const admin = await findOne().select("-password"); // Fetch admin data excluding the password
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin data not found.",
      });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
export async function updateAdminData(req, res) {
  try {
    const admin = await findOne(); // Fetch the only admin record
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Destructure and update the provided fields
    const { name, email, password } = req.body;
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) {
      const salt = await genSalt(10); // Generate a new salt
      admin.password = await hash(password, salt); // Hash the updated password
    }

    // Save the updated admin record
    const updatedAdmin = await admin.save();
    res.status(200).json({
      success: true,
      message: "Admin data updated successfully.",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update admin data.",
    });
  }
}
