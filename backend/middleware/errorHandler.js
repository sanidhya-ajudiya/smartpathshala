const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the stack for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: process.env.NODE_ENV === 'development' ? [err.stack] : []
    });
};

module.exports = errorHandler;
