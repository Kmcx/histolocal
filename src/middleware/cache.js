const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.send(cachedResponse);
            return;
        }

        // Override res.send
        const originalSend = res.send;
        res.send = function (body) {
            cache.set(key, body, duration);
            originalSend.call(this, body);
        };

        next();
    };
};

const clearCache = (pattern) => {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    cache.del(matchingKeys);
};

module.exports = {
    cacheMiddleware,
    clearCache
}; 