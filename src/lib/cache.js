const cache = require('memory-cache');
const EventEmitter = require('events');

const cacheEventEmitter = new EventEmitter();

const memCache = new cache.Cache();
function cacheBooks(eventAdd, eventRemove) {
    cacheEventEmitter.on(eventAdd, ({ data, key }) => {
        memCache.put(key, data);
    });

    cacheEventEmitter.on(eventRemove, () => {
        memCache.clear();
    });

    return async (ctx, next) => {
        const key = ctx.originalUrl;
        const cacheContent = memCache.get(key);
        if (cacheContent) {
            ctx.body = cacheContent;
            return
        }
        await next();
    }
}

module.exports = {
    cacheBooks,
    cacheEventEmitter,
};
