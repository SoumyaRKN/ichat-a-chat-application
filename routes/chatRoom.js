const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');

/* GET chat romm page. */
router.get('/chat-room', (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect("/");
        return;
    }

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.redirect("/");
            return;
        }

        res.render('chatRoom', { title: 'iChat - Connect with strangers' });
    });
});

module.exports = router;
