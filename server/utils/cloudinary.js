const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'fitness-buddy',
            resource_type: 'auto',
            ...options
        });

        // Delete local file after upload
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.warn('Could not delete local file:', error.message);
        }

        return result;
    } catch (error) {
        // Delete local file even if upload fails
        try {
            await fs.unlink(filePath);
        } catch (unlinkError) {
            console.warn('Could not delete local file after failed upload:', unlinkError.message);
        }
        
        throw error;
    }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of local file paths
 * @param {object} options - Upload options
 * @returns {Promise<Array<object>>} - Array of Cloudinary upload results
 */
const uploadMultipleToCloudinary = async (filePaths, options = {}) => {
    try {
        const uploadPromises = filePaths.map(filePath => 
            uploadToCloudinary(filePath, options)
        );
        
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Delete options
 * @returns {Promise<object>} - Cloudinary delete result
 */
const deleteFromCloudinary = async (publicId, options = {}) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, options);
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Get optimized URL for image
 * @param {string} publicId - Cloudinary public ID
 * @param {object} transformations - Image transformations
 * @returns {string} - Optimized image URL
 */
const getOptimizedUrl = (publicId, transformations = {}) => {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        ...transformations
    });
};

module.exports = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
    getOptimizedUrl
};
