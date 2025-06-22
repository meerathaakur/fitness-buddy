
// utils/responseHelpers.js
class ResponseHelpers {
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    static forbidden(res, message = 'Forbidden') {
        return res.status(403).json({
            success: false,
            message
        });
    }

    static notFound(res, message = 'Not Found') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination
        });
    }
}

module.exports = ResponseHelpers;
