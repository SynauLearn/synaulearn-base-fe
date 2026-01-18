// Mock for @walletconnect/keyvaluestorage to prevent SSR localStorage errors
// This file provides a no-op implementation for server-side rendering

class KeyValueStorage {
    constructor() {
        this.storage = new Map();
        this.initialized = true;
    }

    async getKeys() {
        return Array.from(this.storage.keys());
    }

    async getEntries() {
        return Array.from(this.storage.entries());
    }

    async getItem(key) {
        return this.storage.get(key) ?? null;
    }

    async setItem(key, value) {
        this.storage.set(key, value);
    }

    async removeItem(key) {
        this.storage.delete(key);
    }

    async initialize() {
        // No-op for mock
    }
}

module.exports = KeyValueStorage;
module.exports.KeyValueStorage = KeyValueStorage;
module.exports.default = KeyValueStorage;
