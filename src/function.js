function likeArray(obj) {
    return obj ? typeof obj.length == 'number' : null;
}
function each(elements, callback) {
    var i, key;
    if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) {
            if (callback.call(elements[i], i, elements[i]) === false) {
                return elements;
            }
        }
    } else {
        for (key in elements) {
            if (callback.call(elements[key], key, elements[key]) === false) {
                return elements;
            }
        }
    }
    return elements;
}
function type(obj) {
    if (!obj) {
        return undefined;
    }

    var type = '';
    each('Boolean Number HTMLDivElement String Function Array Date RegExp Object Error'.split(' '), function(i, name) {
        if (toString.call(obj).indexOf(name) > -1) {
            type = name == 'HTMLDivElement' ? 'Object' : name;
        }
    });
    return type;
}

function isFunction(fn) {
    return type(fn) == 'Function';
}

function isObject(obj) {
    return type(obj) == 'Object';
}

function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : type(arr) === 'Array';
}

function isString(obj) {
    return typeof obj == 'string';
}
function isPlainObject(obj) {
    // 判断是否为 `{}` 和 `new Object`
    function hasOwn( class2type ) {
        return class2type.hasOwnProperty;
    }
    // 判断不是简单的对象 非 `DOM 节点`，`window`
    if ( JSLite.type( obj ) !== "Object" || obj.nodeType || JSLite.isWindow( obj ) ) return false;
    if ( obj.constructor && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) return false;
    // 如果是 `{}` 和 `new Object` 返回true
    return true;
}

function isJson(obj) {
    var isjson = typeof(obj) == "object" &&
        toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}

function isWindow(win) {
    return win && win == win.window;
}
function isDocument(doc) {
    return doc && doc.nodeType == doc.DOCUMENT_NODE;
}
var P = {};
P = {
    singleTagRE: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    fragmentRE: /^\s*<(\w+|!)[^>]*>/,
    tagExpanderRE: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    table: document.createElement('table'),
    tableRow: document.createElement('tr'),
    containers: {
        '*': document.createElement('div'),
        'tr': document.createElement('tbody'),
        'tbody': P.table,
        'thead': P.table,
        'tfoot': P.table,
        'td': P.tableRow,
        'th': P.tableRow
    }
}
// fragment
// 需要一个HTML字符串和一个可选的标签名
// 生成DOM节点从给定的HTML字符串节点。
// 生成的DOM节点作为一个数组返回。
function fragment(html, name) {
    var dom, container;
    if (P.singleTagRE.test(html)) dom = JSLite(document.createElement(RegExp.$1));
    if (!dom) {
        if (html.replace) {
            html = html.replace(P.tagExpanderRE, "<$1></$2>");
        }
        if (name === undefined) {
            name = P.fragmentRE.test(html) && RegExp.$1;
        }
        if (!(name in P.containers)) {
            name = '*';
        }
        container = P.containers[name];
        container.innerHTML = '' + html;
        dom = each(slice.call(container.childNodes), function() {
            container.removeChild(this);
        });
    }
    return dom;
}

function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg;
}

//将样式属性字符转换成驼峰。
function camelCase(string){ 
    // Support: IE9-11+
    return string.replace( /^-ms-/, "ms-" ).replace( /-([a-z])/g, function( all, letter ) {
        return letter.toUpperCase();
    });
}

//将字符串格式化成 如border-width 样式上使用
function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
}