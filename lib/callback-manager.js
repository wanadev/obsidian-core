"use strict";

var Class = require("abitbol");
var lodash = require("lodash");
var uuid = require("uuid");

var cu = require("../helpers/class-utils.js");

/**
 * @class obsidian-core.lib.callback-manager
 * @constructor
 * @param {String} ...evNames
 */
var CallbackManager = Class.$extend({

    __init__: function(...evNames) {
        this.$data._stop = false;
        this.$data.callbacks = {};  // {evName: [{id: String, cb: Function, opt: {}, ...}, ...]}
        this.$data.defaultOptions = {};
        if (evNames.length > 0) {
            this.addEvName(...evNames);
        }
    },

    /**
     * @property callbacks
     * @type Object
     */
    getCallbacks: cu.getter,

    /**
     * @property defaultOptions
     * @type Object
     * @default {}
     */
    getDefaultOptions: cu.getter,
    setDefaultOptions: cu.setter,

    /**
     * Add a new authorized evName.
     *
     * @method addEvName
     * @param {String} ...evNames
     */
    addEvName: function(...evNames) {
        for (var i = 0 ; i < evNames.length ; i++) {
            var evName = evNames[i];
            if (!this.$data.callbacks[evName]) {
                this.$data.callbacks[evName] = [];
            }
        }
    },

    /**
     * Register a callback.
     *
     *     .add("draw", function() {});
     *     .add("draw", {id: "foobar"}, function() {});
     *
     * @method add
     * @param {String} evName
     * @param {Object} [options]
     * @param {Function} callback
     * @return {String} The callback id
     */
    add: function(evName, options, callback) {
        if (arguments.length < 2 || arguments > 3) {
            throw new Error("ValueError");
        }
        if (!this.$data.callbacks[evName]) {
            throw new Error("WrongEvName: The '" + evName + "' event does not exist");
        }

        if (arguments.length == 2) {
            options = {};
            callback = arguments[1];
        } else {
            options = arguments[1];
            callback = arguments[2];
        }

        var item = {
            id: options.id || uuid.v4(),
            cb: callback
        };

        lodash.merge(item, this.defaultOptions, options);

        this.remove(item.id);
        this.$data.callbacks[evName].push(item);

        return item.id;
    },

    /**
     * Unregister a callback.
     *
     * @method remove
     * @param {String} id
     */
    remove: function(id) {
        for (var evName in this.$data.callbacks) {
            var result = lodash.remove(this.$data.callbacks[evName], item => item.id === id);
            if (result.length > 0) {
                break;
            }
        }
    },

    /**
     * Call all callbacks registered for the given evName.
     *
     * Options:
     *
     *     {
     *         filter: Object|Array|Function,    // e.g: {field: "value"}
     *                                           //      [{field: "value1"}, {field: "value2"}]
     *                                           //      function(obj) { return obj.field > 0; }
     *         orderBy: String,
     *         order: "asc"|"desc"
     *     }
     *
     * @method call
     * @param {String} evName
     * @param {Array} args The arguments that will be passed to the callback (optional)
     * @param {Object} options Options to filter/order the calls (optional)
     */
    call: function(evName, args, options) {
        if (!this.$data.callbacks[evName]) {
            throw new Error("WrongEvName: The '" + evName + "' event does not exist");
        }

        args = args || [];
        options = options || {};

        var callbacks = this._getCallbacks(evName, options.filter, options.orderBy, options.order);

        this.$data._stop = false;

        for (var i = 0 ; i < callbacks.length ; i++) {
            callbacks[i].cb.apply(null, args);
            if (this.$data._stop) {
                break;
            }
        }
    },

    /**
     * Stop the call of the callback stack for the current event.
     * (equivalent to Javascript's event.stopPropagation() )
     *
     * @method stop
     */
    stop: function() {
        this.$data._stop = true;
    },

    /**
     * Get callbacks applying filter, orders,...
     *
     * @method _getCallbacks
     * @private
     * @param {String} evName
     * @param {Array|Object|Function} filter
     * @param {String} orderBy
     * @param {String} order ("asc", "desc")
     * @return {Array}
     */
    _getCallbacks: function(evName, filter, orderBy, order) {
        order = order || "asc";

        var callbacks = [];

        if (filter) {
            if (!lodash.isArray(filter)) {
                filter = [filter];
            }
            for (var i = 0 ; i < filter.length ; i++) {
                callbacks = lodash.concat(callbacks, lodash.filter(this.$data.callbacks[evName], filter[i]));
            }
        } else {
            callbacks = this.$data.callbacks[evName];
        }

        if (orderBy) {
            callbacks = lodash.orderBy(callbacks, [orderBy], [order]);
        }

        return callbacks;
    }

});

module.exports = CallbackManager;
