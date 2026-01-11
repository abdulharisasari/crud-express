const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.loginWithFirebase = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    // verify firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, picture } = decoded;

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { name, photo: picture },
    });

    // backend JWT
    const backendToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: backendToken,
      user,
    });
  } catch (err) {
    res.status(401).json({
      message: 'Invalid Firebase token',
      error: err.message,
    });
  }
};
