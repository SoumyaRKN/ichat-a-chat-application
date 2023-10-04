const express = require('express');
const router = express.Router();
const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require("../models/User");

/* Verify User */
router.post('/verifyUser', (req, res, next) => {
    try {
        User.findOne({ email: req.body.email }).then((user, error) => {
            if (error) {
                console.log(error);
                res.json({ success: false, error: "UNEXPECTED ERROR!" });
                return;
            }

            if (user) {
                compare(req.body.password, user.password, (err, result) => {
                    if (result && user.isActive) {
                        const token = sign({ name: user.name, email: user.email, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '24h' });
                        res.cookie("token", token, { maxAge: 900000, httpOnly: true });
                        res.json({ success: true, data: { token, name: user.name } });
                        return;
                    } else {
                        res.json({ success: false, error: "ACCESS DENIED!" });
                        return;
                    }
                });
            } else {
                res.json({ success: false, error: "USER DOES NOT EXISTS!" });
                return;
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, error: "UNEXPECTED ERROR!" });
        return;
    }
});

module.exports = router;
