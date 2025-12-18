const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. Storage Configuration for Task Files (Multiple Files) ---
// Destination: uploads/files
const taskFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '..', 'uploads', 'files');
        // Ensure the directory exists
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // Create a unique filename: fieldname-timestamp-original_name.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter for Task Files (Optional: e.g., only allow documents and PDFs)
const taskFileFilter = (req, file, cb) => {
    // Example: Allow common document types
    if (file.mimetype.startsWith('image') || file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type for task. Only documents and images are allowed.'), false);
    }
};

// Multer instance for Task files
const uploadTaskFiles = multer({
    storage: taskFilesStorage,
    fileFilter: taskFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Example: 5MB file size limit
});

// --- 2. Storage Configuration for User Avatar (Single Image) ---
// Destination: uploads/images
const userImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '..', 'uploads', 'images');
        // Ensure the directory exists
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // Create a unique filename: user-id-timestamp.ext
        // Note: You might use req.user._id here if authentication middleware runs first
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter for User Images (Only allow image types)
const userImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type for avatar. Only images are allowed.'), false);
    }
};

// Multer instance for User avatar
const uploadUserAvatar = multer({
    storage: userImageStorage,
    fileFilter: userImageFilter,
    limits: { fileSize: 1024 * 1024 * 2 } // Example: 2MB file size limit
});

module.exports = {
    uploadTaskFiles,
    uploadUserAvatar
};