const multer = require('multer');
const path = require('path');
const fs = require('fs');


const taskFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '..', 'uploads', 'files');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const taskFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type for task. Only documents and images are allowed.'), false);
    }
};

const uploadTaskFiles = multer({
    storage: taskFilesStorage,
    fileFilter: taskFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } 
});

const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '..', 'uploads', 'images');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const userImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type for avatar. Only images are allowed.'), false);
    }
};

const uploadUserAvatar = multer({
    storage: userImageStorage,
    fileFilter: userImageFilter,
    limits: { fileSize: 1024 * 1024 * 2 } 
});

module.exports = {
    uploadTaskFiles,
    uploadUserAvatar
};
