const Cachable = require("node-cache");
const cache = new Cachable({ stdTTL: 0, checkperiod: 0 });

/**
 * Set a cache data
 * @param {String} key cache key
 * @param {Object} data A element to cache. it to a serialized JSON
 * @param {Number} ttl The time to live in seconds.
 * @returns boolean
 */
exports.set = async (key, data, ttl = 10000) => {
  return cache.set(key, data, ttl);
}

/**
 * Get a cache data
 * @param {String} key cache key
 * @returns The value stored in the key
 */
exports.get = async (key) => {
  return cache.get(key);
}

/**
 * Delete a cached data
 * @param {String} key cache key
 * @returns The value stored in the key
 */
exports.del = async (key) => {
  return cache.del(key);
}


/**
 * Check if key cache exist
 * @param {String} key
 * @returns Boolean
 */
exports.has = async (key) => {
  return cache.has(key);
}