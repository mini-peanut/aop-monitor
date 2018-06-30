/**
 * @file AOP 埋点工具类
 * - 监控对象可以是类或者是对象
 * - 如果是类监控的是类，则监控其的prototype对象
 * - 监控函数调用发生在业务逻辑函数调用之后；
 * - 监控逻辑不能修改业务逻辑的数据或者返回结果
 */

const isFunction = fn => typeof fn === 'function';

/**
 *
 * @param send 发送埋点的方法
 * @returns {function(*=): function(*): *}
 */
function initAopMonitor(send) {

    /**
     * @param {Object} watchlist 监控列表
     */
    return (watchList = {}) => (target) => {
        const owner = target.prototype || target;
        for (const item in watchList) {

            if (watchList.hasOwnProperty(item) && !owner.hasOwnProperty(item))  {
                throw new Error(`[aop-monitor]-> 未在owner中发现${item}属性，请确保监控字段正确 且 没有使用箭头函数`);
            }
            if (watchList.hasOwnProperty(item) && owner.hasOwnProperty(item)) {
                inject(item, owner, watchList[item], send);
            }
        }

        return target;
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
        const logParams = callback.apply(this, arguments);
        if (logParams) {
            if (logParams instanceof Array) {
                for (let logParam of logParams) {
                    send(logParam);
                }
            }
            else {
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
        const result = func.apply(this, arguments);
        // 为了防止后置出错
        try {
            afterFunc.apply(this, arguments);
        }
        finally {

        }

        return result;
    };
}


export default initAopMonitor;
