const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET =
	process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

class AuthController {
	async register(req, res) {
		try {
			const { email, password, name, role } = req.body;

			// Validate input
			if (!email || !password || !name || !role) {
				return res.status(400).json({ error: "All fields are required" });
			}

			// Valid roles: doctor, patient, admin
			const validRoles = ["doctor", "patient", "admin"];
			if (!validRoles.includes(role)) {
				return res
					.status(400)
					.json({ error: "Invalid role. Must be doctor, patient, or admin" });
			}

			// Check if user exists
			const existingUser = userModel.findByEmail(email);
			if (existingUser) {
				return res.status(409).json({ error: "User already exists" });
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create user
			const user = userModel.create({
				email,
				password: hashedPassword,
				name,
				role,
			});

			// Generate token
			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role },
				JWT_SECRET,
				{ expiresIn: JWT_EXPIRES_IN },
			);

			res.status(201).json({
				message: "User registered successfully",
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
				token,
			});
		} catch (error) {
			console.error("Registration error:", error);
			res.status(500).json({ error: "Registration failed" });
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body;

			// Validate input
			if (!email || !password) {
				return res
					.status(400)
					.json({ error: "Email and password are required" });
			}

			// Find user
			const user = userModel.findByEmail(email);
			if (!user) {
				return res.status(401).json({ error: "Invalid credentials" });
			}

			// Verify password
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return res.status(401).json({ error: "Invalid credentials" });
			}

			// Generate token
			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role },
				JWT_SECRET,
				{ expiresIn: JWT_EXPIRES_IN },
			);

			res.status(200).json({
				message: "Login successful",
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
				token,
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({ error: "Login failed" });
		}
	}

	async verify(req, res) {
		try {
			// User info is already attached by middleware
			res.status(200).json({
				message: "Token is valid",
				user: req.user,
			});
		} catch (error) {
			console.error("Verification error:", error);
			res.status(500).json({ error: "Verification failed" });
		}
	}
}

module.exports = new AuthController();
