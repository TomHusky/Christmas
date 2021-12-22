module.exports = {
    // 过期时间，默认一小时
    expire: 60 * 60 * 1000,
    /**
     * 设置过期时间
     * @param expire
     * @returns {exports}
     */
    setExpire: function (expire) {
        this.expire = expire;
        return this;
    },
    /**
     * 设置 localStorage
     * @param key
     * @param value
     */
    set: function (key, value) {
        localStorage.removeItem(key);
        let isObject = value instanceof Object,
            _time = new Date().getTime(),
            _expire = this.expire;

        // 如果不是对象，新建一个对象把 value 存起来
        if (!isObject) {
            let b = value;
            value = {};
            value._value = b;
        }
        // 加入时间
        value._time = _time;
        // 过期时间
        value._expire = _time + _expire;
        // 是否一个对象
        value._isObject = isObject;
        localStorage.setItem(key, JSON.stringify(value));
        return this;
    },
    /**
     * 判断一个 localStorage 是否过期
     * @param key
     * @returns {boolean}
     */
    isExpire: function (key) {

        let isExpire = true,
            value = localStorage.getItem(key),
            now = new Date().getTime();

        if (value) {
            value = JSON.parse(value);
            // 当前时间是否大于过期时间
            isExpire = now > value._expire;
        } else {
            // 没有值也是过期
        }
        return isExpire;
    },
    /**
     * 获取某个 localStorage 值
     * @param key
     * @returns {*}
     */
    get: function (key) {
        let isExpire = this.isExpire(key),
            value = null;
        if (!isExpire) {
            value = localStorage.getItem(key);
            value = JSON.parse(value);
            if (!value._isObject) {
                value = value._value;
            }
        }
        return value;
    }
};