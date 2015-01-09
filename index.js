/**
 * @file ie6fixed
 *
 * 我们依靠css expression来做性能更好的fixed效果
 * 虽然这种性能也很差, 但是要好过基于滚动事件的.
 *
 * @author Leon(leonlu@outlook.com)
 */

(function () {

    var isIe6 = !window.XMLHttpRequest;

    var MAP = {
        horizontal: {
            offset: 'scrollLeft',
            client: 'clientWidth',
            coordinate: 'left',
            size: 'width'
        },
        vertical: {
            offset: 'scrollTop',
            client: 'clientHeight',
            coordinate: 'top',
            size: 'height'
        }
    };

    var html = document.getElementsByTagName('html')[0];

    // 防止抖动
    if (isIe6) {
        html.style.backgroundAttachment = 'fixed';
        html.style.backgroundImage = 'url(about:blank)';
    }

    html = null;

    function isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    function isPrecent(obj) {
        return (obj + '').slice(-1) === '%';
    }


    /**
     * 弄一下数值
     * @param  {string} operand     被操作数
     * @param  {string} coefficient 系数
     * @return {string}
     */
    function getPercentStyleValue(coefficient, operand) {
        // 只要数值
        var value = parseInt(coefficient, 10);
        return isPrecent(coefficient)
            ? operand + '*' + value / 100
            : value;
    }

    function getCoordinate(direction, size, from, to) {

        var result = {};
        var conf = MAP[direction];

        var OFFSET = 'document.documentElement.' + conf.offset;
        var CLIENT = 'document.documentElement.' + conf.client;

        // 如果同是有from和to, 那么要设定coordinate和size
        // coordinate = offset + from
        // size = clientSize - from - to
        if (!isUndefined(from) && !isUndefined(to)) {
            result[conf.coordinate] = ''
                + 'eval('
                +     OFFSET
                +     '+'
                +     getPercentStyleValue(from, CLIENT)
                + ')+"px"';

            result[conf.size] = ''
                + 'eval('
                +     CLIENT
                +     '-' + getPercentStyleValue(from, CLIENT)
                +     '-' + getPercentStyleValue(to, CLIENT)
                + ')+"px"';
        }

        // 如果只有to, 那么要使用参数size, 只需要设定coordinate
        // coordinate = offset + clientSize - size - to;
        else if (isUndefined(from) && !isUndefined(to)) {
            result[conf.coordinate] = ''
                + 'eval('
                +     OFFSET
                +     '+'
                +     CLIENT
                +     '-' + getPercentStyleValue(size, CLIENT)
                +     '-' + getPercentStyleValue(to, CLIENT)
                + ')+"px"';
        }
        // 如果只from, 那么只需要设定coordinate
        // coordinate = offset + from
        else {
            result[conf.coordinate] = ''
                + 'eval('
                +     OFFSET
                +     '+' + getPercentStyleValue(from, CLIENT)
                + ')+"px"';
        }

        return result;
    }

    function getStyle(element, options) {
        var horizontalStyle = getCoordinate(
            'horizontal', options.width || element.offsetWidth,
            options.left, options.right
        );
        var verticalStyle = getCoordinate(
            'vertical', options.height || element.offsetHeight,
            options.top, options.bottom
        );
        for (var name in verticalStyle) {
            horizontalStyle[name] = verticalStyle[name];
        }
        return horizontalStyle;
    }

    function fixed(element, options) {
        if (!isIe6) {
            return;
        }
        // 强制绝对定位
        element.style.position = 'absolute';
        var style = getStyle(element, options);
        for (var name in style) {
            element.style.setExpression(name, style[name]);
        }
    }

    if (typeof define === 'function' && define.amd) {
        define('ie6fixed', [], fixed);
    }
    else {
        window.ie6fixed = fixed;
    }

})();
