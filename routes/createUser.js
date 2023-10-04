const express = require('express');
const router = express.Router();
const { hash } = require('bcrypt');
const User = require("../models/User");

/* Create User */
router.post('/createUser', (req, res, next) => {
    try {
        hash(req.body.password, 10, (err, hash) => {
            if (err) {
                res.json({ success: false, error: "UNEXPECTED ERROR!" });
                return;
            }

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hash
            });

            user.save().then(result => {
                res.json({ success: true, data: { message: "ACCOUNT CREATED SUCCESSFULLY!" } });
                return;
            }).catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ success: false, error: `This ${Object.keys(err.keyValue)} already exists! Try using different ${Object.keys(err.keyValue)}` });
                    return;
                }
                res.json({ success: false, error: "UNEXPECTED ERROR!" });
                return;
            });
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, error: "UNEXPECTED ERROR!" });
        return;
    }
});

module.exports = router;
