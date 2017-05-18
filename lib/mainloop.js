"use strict";

var Class = require("abitbol");
var lodash = require("lodash");

var cu = require("../helpers/class-utils.js");

/**
 * A generic 60 Hz loop.
 *
 * @class obsidian-core.lib.mainloop
 * @constructor
 * @param {Object} params
 */
var MainLoop = Class.$extend({

    __init__: function(params) {
        this.$data.callbacks = [];
        this.$data.enabled = false;
        cu.applyProperties(this, params);
    },

    /**
     * The callbacks
     *
     * @property callbacks
     * @type Function[]
     * @default []
     */
    getCallbacks: cu.getter,
    setCallbacks: cu.setter,

    /**
     * Start the loop.
     *
     * @method start
     */
    start: function() {
        this.$data.enabled = true;
        lodash.defer(this._loop);
    },

    /**
     * Stop the loop.
     *
     * @method stop
     */
    stop: function() {
        this.$data.enabled = false;
    },

    /**
     * Add a callback.
     *
     * @method addCallback
     * @param {Function} callback
     */
    addCallback: function(callback) {
        this.$data.callbacks.push(callback);
    },

    /**
     * Remove a callback.
     *
     * @method removeCallback
     * @param {Function} callback
     */
    removeCallback: function(callback) {
        var index = this.$data.callbacks.indexOf(callback);
        if (index !== -1) {
            this.$data.callbacks.splice(index, 1);
        }
    },

    /**
     * The loop.
     *
     * @method _loop
     * @private
     * @param {Number} timestamp
     */
    _loop: function(timestamp) {
        if (!this.$data.enabled) {
            return;
        }
        for (var i = 0 ; i < this.$data.callbacks.length ; i++) {
            try {
                this.$data.callbacks[i](timestamp);
            } catch (error) {
                console.error(error);
            }
        }
        requestAnimationFrame(this._loop);
    }

});

module.exports = MainLoop;
