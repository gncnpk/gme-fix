// ==UserScript==
// @name         GME Fix
// @namespace    https://github.com/gncnpk/gme-fix
// @version      0.0.1
// @description  Allows Google Maps road editor to be usable outside of a iFrame.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://maps.google.com/roadeditor/iframe*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';

    // Create a proxy to intercept property assignments
    function createInterceptedObject(target = {}) {
        return new Proxy(target, {
            set: function(obj, prop, value) {
                if (prop === 'ag') {
                    // Override the ag function when it's assigned
                    console.log('Intercepting ag function assignment');
                    obj[prop] = function(a, b) {
                        console.log('ag redirect blocked:', a, b);
                        return false;
                    };
                    return true;
                } else {
                    obj[prop] = value;
                    return true;
                }
            },
            get: function(obj, prop) {
                return obj[prop];
            }
        });
    }

    // Override the global object creation
    let originalObject = window.default_GeoUgcMapsRoadsEditorUi;

    Object.defineProperty(window, 'default_GeoUgcMapsRoadsEditorUi', {
        get: function() {
            return originalObject;
        },
        set: function(value) {
            console.log('default_GeoUgcMapsRoadsEditorUi being set');
            originalObject = createInterceptedObject(value || {});
        },
        configurable: true
    });

    // Also override on 'this' context (in case it's not window)
    if (typeof this !== 'undefined' && this !== window) {
        Object.defineProperty(this, 'default_GeoUgcMapsRoadsEditorUi', {
            get: function() {
                return originalObject;
            },
            set: function(value) {
                console.log('default_GeoUgcMapsRoadsEditorUi being set on this');
                originalObject = createInterceptedObject(value || {});
            },
            configurable: true
        });
    }

    // Initialize with intercepted object if it doesn't exist
    if (!window.default_GeoUgcMapsRoadsEditorUi) {
        window.default_GeoUgcMapsRoadsEditorUi = createInterceptedObject({});
    }

    console.log('Userscript loaded - ready to intercept ag function');
})();
