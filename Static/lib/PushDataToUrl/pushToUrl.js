/*
 * JavaScript PushToUrl
 * Author: Manish Baral
 * Version: 2.0.0
 * Copyright © 2019
 * https://github.com/baralmanish/PushDataToUrl
*/

(function (factory) {

    if (typeof module === 'object' && typeof module.exports === 'object')
        module.exports = factory();
    else if (typeof window === 'object')
        window.pushToUrl = factory();
    else
        console.error('To use this library you need to either use browser or node.js [require()]');

})(function () {
    "use strict"

    let urlParams;
    const BASE_URL = location.protocol + '//' + location.host + location.pathname;


    // Plugin Constructor
    let pushToUrl = function () {
        //init();
    }

    // Add
    pushToUrl.prototype.add = function (options) {
        const key = options.key;
        const value = options.value;
        if (key && value) {
            if (detectQueryString()) {
                urlParams = detectQueryString(key, value);
            } else {
                urlParams = key + '=' + value;
            }
            const newUrl = BASE_URL + '?' + urlParams;
            window.history.pushState({ path: newUrl }, '', newUrl);
            return options;
        }
    }

    pushToUrl.prototype.get = function (key = null) {
        if (key) {
            let result = null;
            let tmp = [];
            location.search
                .substr(1)
                .split("&")
                .forEach(function (item) {
                    tmp = item.split("=");
                    if (tmp[0] === key) result = decodeURIComponent(tmp[1]);
                });
            return result;
        }
    }

    // remove selected key
    pushToUrl.prototype.remove = function (key = null) {
        if (key) {
            const count = countUrlParams();
            let newUrl = BASE_URL;
            if (count) {
                if (count > 1) {
                    newUrl = location.href.split('?')
                        .map((url, i) => !i ? url : url
                            .replace(new RegExp(`&${key}=[^&]*|${key}=[^&]*&`), ''))
                        .join('?');

                }
                window.history.pushState({ path: newUrl }, '', newUrl);
                return key;
            }
        }
    }

    // remove all
    pushToUrl.prototype.removeAll = function () {
        window.history.pushState({ path: BASE_URL }, '', BASE_URL);
        return BASE_URL;
    }

    // Private function to initialize
    function init() {
        let codeDoc = [
            ["initialize", "var pushToUrl = new pushToUrl()"],
            ["add key and value to url params", "pushToUrl.add({key: 'name', value: 'John'});"],
            ["get selected key from url params", "pushToUrl.get('name');"],
            ["delete selected key from url params", "pushToUrl.remove('name');"],
            ["remove all url params", "pushToUrl.removeAll();"]
        ]
        console.table(codeDoc);
    }

    // Private function to detect url query string
    function detectQueryString(key = null, value = null) {
        const currentUrl = window.location.href;
        if (key || value) {
            let urlParams = new URLSearchParams(location.search);
            urlParams.set(key, value);
            return urlParams.toString();
        } else {
            // regex pattern for detecting ? character
            const pattern = new RegExp(/\?+/g);
            return pattern.test(currentUrl);
        }
    }

    // Private function to count the url query parameters
    function countUrlParams() {
        let cUrl = window.location.href;
        let matches = cUrl.match(/[a-z\d]+=[a-z\d]+/gi);
        return matches ? matches.length : 0;
    }

    return pushToUrl;
});
