const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // Shranimo slike v mapo public/images/
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname); // Ime datoteke je trenutni čas + originalno ime
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Shranimo samo JPEG in PNG slike
  } else {
    cb(new Error('Only JPEG and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Omejimo velikost datoteke na 5MB
  fileFilter: fileFilter
});

module.exports = upload;
