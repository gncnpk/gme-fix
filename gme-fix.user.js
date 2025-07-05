// ==UserScript==
// @name         GME Fix
// @namespace    https://github.com/gncnpk/gme-fix
// @version      0.0.2
// @description  Allows Google Maps road editor to be usable outside of a iFrame.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://maps.google.com/roadeditor/iframe*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  let originalObject = null;
  let agBlocked = false;

  // Lightweight function to block ag calls
  function blockAg() {
    return false;
  }

  // Intercept the object assignment with minimal overhead
  function interceptObject(obj) {
    if (!obj || agBlocked) return obj;

    // Only intercept if 'ag' property is being set
    if (obj.hasOwnProperty('ag')) {
      console.log('Blocking ag function');
      obj.ag = blockAg;
      agBlocked = true;
    }

    // Set up a one-time property descriptor for future 'ag' assignments
    if (!obj.hasOwnProperty('ag')) {
      Object.defineProperty(obj, 'ag', {
        set: function (value) {
          console.log('ag assignment blocked');
          // Don't actually set the value, keep our blocker
        },
        get: function () {
          return blockAg;
        },
        configurable: true,
        enumerable: true,
      });
    }

    return obj;
  }

  // Set up property descriptor for the main object
  Object.defineProperty(window, 'default_GeoUgcMapsRoadsEditorUi', {
    get: function () {
      return originalObject;
    },
    set: function (value) {
      originalObject = interceptObject(value || {});
    },
    configurable: true,
  });

  // Initialize if needed
  if (!window.default_GeoUgcMapsRoadsEditorUi) {
    window.default_GeoUgcMapsRoadsEditorUi = interceptObject({});
  }

  console.log('GME Fix loaded - ag function blocking ready');
})();
