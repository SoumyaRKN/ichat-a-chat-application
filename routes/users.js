const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');

/* GET Users page. */
router.get('/users', (req, res, next) => {
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

    res.render('users', { title: 'iChat - Connect with strangers' });
  });
});

module.exports = router;
