"use strict";

var _globalObject;
try {
    _globalObject = window;
} catch (error) {
    _globalObject = global;
}

/**
 * A set of functions for handling UUIDs.
 *
 * @class obsidian-core.helpers.uuid-helper
 */
module.exports = {

    /**
     * Get a UUID version 4 (RFC 4122).
     *
     * Try to use the browser's secure implementation if available (only
     * available with HTTPS and on localhost) else use a fallback
     * implementation.
     * @returns 
     */
    uuid4: function () {
        if (_globalObject.crypto && _globalObject.crypto.randomUUID) {
            return _globalObject.crypto.randomUUID();
        } else {
            return this.fallbackUuid4();
        }
    },

    /**
     * Generate a UUID version 4 (RFC 4122), fallback implementation.
     *
     * From: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     */
    fallbackUuid4: function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replaceAll(/[xy]/g, function (c) {
            const r = Math.trunc(Math.random() * 16);
            const v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};
