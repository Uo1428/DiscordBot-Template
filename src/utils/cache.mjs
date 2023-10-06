class cache {
    constructor() {
        this.store = new Map();
    }

    get(key) {
        return this.store.get(key);
    }

    set(key, value, minutes) {
        this.store.set(key, value);

        if (minutes) {
            setTimeout(() => this.store.delete(key), minutes * 6e4).unref();
        }

        return true;
    }

    delete(key) {
        const item = this.store.get(key);

        if (item) {
            this.store.delete(key);
            return item;
        }

        return null;
    }

    clear() {
        this.store.clear();
        return true;
    }
}

export default new cache();
