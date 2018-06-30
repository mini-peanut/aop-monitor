/**
 * @file AOP 埋点工具类
 * - 监控对象可以是类或者是对象
 * - 如果是类监控的是类，则监控其的prototype对象
 * - 监控函数调用发生在业务逻辑函数调用之后；
 * - 监控逻辑不能修改业务逻辑的数据或者返回结果
 */

var isFunction = function isFunction(fn) {
    return typeof fn === 'function';
};

/**
 *
 * @param send 发送埋点的方法
 * @returns {function(*=): function(*): *}
 */
function initAopMonitor(send) {

    /**
     * @param {Object} watchlist 监控列表
     */
    return function () {
        var watchList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return function (target) {
            var owner = target.prototype || target;
            for (var item in watchList) {

                if (watchList.hasOwnProperty(item) && !owner.hasOwnProperty(item)) {
                    throw new Error('[aop-monitor]-> \u672A\u5728owner\u4E2D\u53D1\u73B0' + item + '\u5C5E\u6027\uFF0C\u8BF7\u786E\u4FDD\u76D1\u63A7\u5B57\u6BB5\u6B63\u786E \u4E14 \u6CA1\u6709\u4F7F\u7528\u7BAD\u5934\u51FD\u6570');
                }
                if (watchList.hasOwnProperty(item) && owner.hasOwnProperty(item)) {
                    inject(item, owner, watchList[item], send);
                }
            }

            return target;
        };
    };
}

/**
 * inject 劫持注入callback
 * @private
 * @param {string} item 属性名称
 * @param {Object} owner owner对象
 * @param {Function} callback 注入函数
 * @param {Function} send 发送埋点的方法
 */
function inject(item, owner, callback, send) {
    if (!isFunction(owner[item])) {
        throw new Error('item should be function');
    }

    if (!isFunction(callback)) {
        throw new Error('callback should be function');
    }

    owner[item] = after(owner[item], function () {
        var logParams = callback.apply(this, arguments);
        if (logParams) {
            if (logParams instanceof Array) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = logParams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var logParam = _step.value;

                        send(logParam);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                send(logParams);
            }
        }
    });
}

/**
 * Injects the method called after the core method.
 *
 * @param {Function} func The core method
 * @param {Function} afterFunc The method to be injected after
 *     the core method.
 */
function after(func, afterFunc) {

    return function () {
        var result = func.apply(this, arguments);
        // 为了防止后置出错
        try {
            afterFunc.apply(this, arguments);
        } finally {}

        return result;
    };
}

export default initAopMonitor;