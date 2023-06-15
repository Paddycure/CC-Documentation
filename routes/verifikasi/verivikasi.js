const jawt = require('jsonwebtoken');

function verifikasiUser(req, res, next) {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }
  
    const token = bearerToken.split(' ')[1]; // Mengambil token dari header Authorization
    const secretKey = 'himitsu'; // Kata kunci rahasia yang digunakan untuk verifikasi token
  
    jawt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ error: 'Token tidak valid' });
      }
      req.akun = decoded; // Menyimpan data yang terkandung dalam token ke dalam req.user
      next();
    });
  }

  module.exports = verifikasiUser;