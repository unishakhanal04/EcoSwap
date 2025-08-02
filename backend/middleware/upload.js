const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const productUploadDir = path.join(uploadDir, 'products');
const profileUploadDir = path.join(uploadDir, 'profiles');

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.uploadType === 'profile') {
      cb(null, profileUploadDir);
    } else {
      cb(null, productUploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const uploadProductImages = (req, res, next) => {
  req.uploadType = 'product';
  upload.array('images', 10)(req, res, next);
};

const uploadProfileImage = (req, res, next) => {
  req.uploadType = 'profile';
  upload.single('profileImage')(req, res, next);
};

module.exports = {
  upload,
  uploadProductImages,
  uploadProfileImage
};