const cache = require('memory-cache');

const memCache = new cache.Cache();
function cacheBooks(eventAdd, eventRemove) {
    return async (ctx, next) => {
        const key = ctx.originalUrl;

        ctx.app.on(eventAdd, (data) => {
            memCache.put(key, data);
        });

        ctx.app.on(eventRemove, () => {
            memCache.clear();
        });

        const cacheContent = memCache.get(key);
        if (cacheContent) {
            ctx.body = cacheContent;
            return
        }
        await next();
    }
}

module.exports = {
    cacheBooks
};
