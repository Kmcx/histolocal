const { AppError } = require('./errorHandler');

const apiVersion = (version) => {
    return (req, res, next) => {
        const requestedVersion = req.headers['api-version'];
        
        if (!requestedVersion) {
            return next(new AppError('API version is required', 400));
        }

        if (requestedVersion !== version) {
            return next(new AppError(`API version ${requestedVersion} is not supported. Please use version ${version}`, 400));
        }

        // Add version info to response headers
        res.setHeader('X-API-Version', version);
        next();
    };
};

module.exports = apiVersion; 