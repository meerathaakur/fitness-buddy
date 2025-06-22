
// utils/fileHelpers.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class FileHelpers {
    static createMulterConfig(destination = 'uploads/', allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = path.join(__dirname, '..', destination);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });

        const fileFilter = (req, file, cb) => {
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type'), false);
            }
        };

        return multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB
            }
        });
    }

    static deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    static getFileUrl(filename, baseUrl) {
        return `${baseUrl}/uploads/${filename}`;
    }
}

module.exports = FileHelpers;
