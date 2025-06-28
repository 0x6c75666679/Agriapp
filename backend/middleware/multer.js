const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory structure if it doesn't exist
const createDirectories = () => {
    const dirs = ['./uploads'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createDirectories();

// Helper function to get user folder name
const getUserFolder = (req) => {
    const username = req.user?.username || req.body.username || req.user?.name || req.body.name || 'anonymous';
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 character random string
    return `${username}_${randomSuffix}`;
};

// Helper function to ensure user directory exists
const ensureUserDirectory = (req) => {
    const userFolder = getUserFolder(req);
    const userDir = `./uploads/${userFolder}`;
    const profileDir = `${userDir}/profile`;
    const productsDir = `${userDir}/products`;
    
    // Create all directories
    [userDir, profileDir, productsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    return { userFolder, userDir, profileDir, productsDir };
};

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { profileDir } = ensureUserDirectory(req);
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.originalname.replace(/\s/g, '_');
        const nameWithoutExt = path.parse(fileName).name;
        const ext = path.parse(fileName).ext;
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    },
});

// Storage configuration for product pictures
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { productsDir } = ensureUserDirectory(req);
        cb(null, productsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.originalname.replace(/\s/g, '_');
        const nameWithoutExt = path.parse(fileName).name;
        const ext = path.parse(fileName).ext;
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    },
});

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /\.(jpg|jpeg|png|gif|webp)$/i; // Image files only
    if (!allowedTypes.test(file.originalname)) {
        return cb(new Error('Only JPG, JPEG, PNG, GIF, and WebP files are allowed'), false);
    }
    cb(null, true);
};

// Profile picture upload middleware (1 file only)
const uploadProfilePicture = (fieldName = 'profilePicture') => {
    return (req, res, next) => {
        const upload = multer({
            storage: profileStorage,
            fileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB limit for profile pictures
                files: 1 // Only 1 file for profile picture
            }
        }).single(fieldName);

        upload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        error: 'Profile picture too large. Maximum size is 2MB' 
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ 
                        error: 'Only one profile picture allowed' 
                    });
                }
                return res.status(400).json({ error: err.message });
            }

            // Log uploaded profile picture
            if (req.file) {
                const { userFolder } = ensureUserDirectory(req);
                console.log(`Profile picture uploaded for ${userFolder}: ${req.file.originalname} → ${req.file.filename}`);
            }

            next();
        });
    };
};

// Product pictures upload middleware (up to 5 files)
const uploadProductPictures = (fieldName = 'productPictures', maxFiles = 5) => {
    return (req, res, next) => {
        const upload = multer({
            storage: productStorage,
            fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit per product picture
                files: maxFiles
            }
        }).array(fieldName, maxFiles);

        upload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        error: 'Product picture too large. Maximum size is 5MB' 
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ 
                        error: `Too many product pictures. Maximum is ${maxFiles}` 
                    });
                }
                return res.status(400).json({ error: err.message });
            }

            // Log uploaded product pictures
            if (req.files && req.files.length > 0) {
                const { userFolder } = ensureUserDirectory(req);
                console.log(`Uploaded ${req.files.length} product picture(s) for ${userFolder}:`);
                req.files.forEach(file => {
                    console.log(`- ${file.originalname} → ${file.filename}`);
                });
            }

            next();
        });
    };
};

// Generic file upload middleware (for backward compatibility)
const fileUpload = (fieldName, maxFiles = 10) => {
    return (req, res, next) => {
        const upload = multer({
            storage: productStorage, // Use product storage as default
            fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
                files: maxFiles
            }
        }).array(fieldName, maxFiles);

        upload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        error: 'File too large. Maximum size is 5MB' 
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ 
                        error: `Too many files. Maximum is ${maxFiles}` 
                    });
                }
                return res.status(400).json({ error: err.message });
            }

            // Log uploaded files
            if (req.files && req.files.length > 0) {
                const { userFolder } = ensureUserDirectory(req);
                console.log(`Uploaded ${req.files.length} file(s) for ${userFolder}:`);
                req.files.forEach(file => {
                    console.log(`- ${file.originalname} → ${file.filename}`);
                });
            }

            next();
        });
    };
};

module.exports = {
    uploadProfilePicture,
    uploadProductPictures,
    fileUpload
};