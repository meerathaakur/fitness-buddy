
// routes/auth.routes.js
const express = require('express');
const passport = require("passport")
const jwt = require("jsonwebtoken")
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/validation.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google login
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google", authController.googleLogin)

// router.get("/google/callback",
//     passport.authenticate("google", { session: false }),
//     (req, res) => {
//         console.log("User:", req.user) // Debugging line to check the user object
//         if (!req.user) {
//             return res.status(400).json({ error: "User not found" })
//         }
//         const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
//         res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`)
//     }
// )

// Facebook Login
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// router.get("/facebook/callback",
//     passport.authenticate("facebook", { session: false }),
//     (req, res) => {
//         const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//         res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
//     }
// );

module.exports = router;
