const responseHandler = (req, res, next) => {
    // Standard Success Response
    res.success = (data = {}, message = 'Operation successful', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    };

    // Standard Error Response
    res.error = (message = 'Operation failed', statusCode = 500, errors = []) => {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    };

    next();
};

module.exports = responseHandler;
