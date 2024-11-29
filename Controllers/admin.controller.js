const bcrypt = require("bcrypt"); // For hashing passwords securely
const jwt = require("jsonwebtoken"); // For generating and verifying JWT tokens
const Admin = require("../Models/admin.model.js"); // Import the Admin model

module.exports = {
  /**
   * Registers the admin (intended to be used only once for system setup).
   * Ensures that only one admin can be registered in the system.
   * @param {Object} req - The request object containing admin details in `body`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  registerAdmin: async (req, res) => {
    try {
      // Check if an admin is already registered
      const existingAdmin = await Admin.findOne();
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin is already registered.",
        });
      }

      // Destructure incoming data from the request body
      const { admin_name, email, password } = req.body;

      // Hash the password for security
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new admin record in the database
      const newAdmin = new Admin({
        admin_name,
        email,
        password: hashedPassword,
      });

      // Save the admin data to the database
      const savedAdmin = await newAdmin.save();
      res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        data: savedAdmin,
      });
    } catch (error) {
      console.error("Error registering admin:", error);
      res.status(500).json({
        success: false,
        message: "Admin registration failed.",
      });
    }
  },

  /**
   * Logs in the admin by verifying email and password.
   * Generates a JWT token upon successful authentication.
   * @param {Object} req - The request object containing `email` and `password`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body; // Extract login credentials from the request
      const admin = await Admin.findOne(); // Fetch the only admin record

      // Check if the provided email matches the registered admin
      if (!admin || admin.email !== email) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or admin not found.",
        });
      }

      // Verify the provided password against the hashed password
      const isAuth = bcrypt.compareSync(password, admin.password);
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
        admin: { admin_name: admin.admin_name, email: admin.email },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  /**
   * Retrieves the admin data, excluding the password.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object for sending admin data or errors.
   */
  getAdminData: async (req, res) => {
    try {
      const admin = await Admin.findOne().select("-password"); // Fetch admin data excluding the password
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
  },

  /**
   * Updates the admin data (admin-only functionality).
   * Allows updating fields like `admin_name`, `email`, and `password`.
   * @param {Object} req - The request object containing updated data in `body`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  updateAdminData: async (req, res) => {
    try {
      const admin = await Admin.findOne(); // Fetch the only admin record
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found.",
        });
      }

      // Destructure and update the provided fields
      const { admin_name, email, password } = req.body;
      if (admin_name) admin.admin_name = admin_name;
      if (email) admin.email = email;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        admin.password = bcrypt.hashSync(password, salt); // Hash the updated password
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
  },
};
