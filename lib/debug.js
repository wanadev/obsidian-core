"use strict";

var Class = require("abitbol");
var lodash = require("lodash");
var Sentry = require("@sentry/browser");

var cu = require("../helpers/class-utils.js");
var CallbackManager = require("./callback-manager.js");


// TODO throw errors for console.error()


/**
 * This class handle and log all logs (console.log|info|warn|error) and uncaught errors.
 *
 * @class obsidian-core.lib.debug
 * @constructor
 * @param {Object} options
 */
var Debug = Class.$extend({

    __init__: function(options={}) {
        this.$data.sentryKey = options.sentryKey;
        this.$data.userId = options.userId || "unknown";
        this.$data.release = options.release || "0.0.0";
        this.$data.useSentry = options.enableSentry && options.sentryKey;
        this.$data.levels = options.levels || ["warn", "error"];
        this.$data.extraDataProvider = options.extraDataProvider;

        this.$data._console_log = console.log.bind(console);
        this.$data._console_info = console.info.bind(console);
        this.$data._console_warn = console.warn.bind(console);
        this.$data._console_error = console.error.bind(console);

        this.$data.MAX_LINES = 100;

        this.$data.logs = [];  // [{type: String, message: String, trace: String, date: Date, data: Object, count: Number}, ...]
        this.$data._caughtMessages = {};

        console.log = this._onConsoleLog.bind(null, "log");
        console.info = this._onConsoleLog.bind(null, "info");
        console.warn = this._onConsoleLog.bind(null, "warn");
        console.error = this._onConsoleLog.bind(null, "error");

        window.onerror = this._onUncaugthError;

        this.callback = new CallbackManager("log");

        if (this.$data.useSentry) {
            this._configureSentry();
        }
    },

    /**
     * Callback Manager
     *
     *     "log" -> function(type, message, trace) {}
     *
     * @property callback
     * @type wnp.lib.callback-manager
     */
    callback: null,

    /**
     * Raw logs.
     *
     * @property logs
     * @type Array
     */
    getLogs: cu.getter,

    /**
     * A function returning extra data to pass to sentry.
     *
     * @property extraDataProvider
     * @type Function
     */
    getExtraDataProvider: cu.getter,
    setExtraDataProvider: cu.setter,

    /**
     * Clear logs.
     *
     * @method clearLogs
     */
    clearLogs: function() {
        this.$data.logs = [];
    },

    _configureSentry: function() {
        Sentry.config(this.$data.sentryKey, {release: this.$data.release});
        Sentry.install();

        Sentry.setUserContext({
            id: this.$data.userId
        });

        Sentry.setTagsContext({
            graphicCard: this._getGraphicCardName()
        });

    },

    _getGraphicCardName: function() {
        var graphicCardName = "unknown";

        try {
            var canvas = document.createElement("canvas");

            var gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
            if (!gl) return graphicCardName;

            var ext = gl.getExtension("WEBGL_debug_renderer_info");
            if (!ext) return graphicCardName;

            graphicCardName = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        } catch (error) {
            // pass
        }

        return lodash.trim(graphicCardName);
    },

    _log: function(type, ...args) {
        var error;
        var data = {};
        var messages = [];

        for (let i = 0 ; i < args.length ; i++) {
            if (args.length > 1 && i == args.length-1 && args[i] && typeof args[i] == "object" && !(args[i] instanceof Error)) {
                data = args[i];
                break;
            }
            if (!error && args[i] instanceof Error) {
                error = args[i];
            }
            messages.push(args[i]);
        }

        if (error && messages.length > 1) {
            try {
                error.message = messages.join(" ");
            } catch (catchedError) {
                error = null; // Will be recomputed below with all messages.
            }
        }

        if (!error) {
            error = new Error(messages.join(" "));
        }

        var tags = data.tags || {};
        tags.component = data.component || "unknown";
        tags.file = data.file || "unknown";

        var extra = data.extra || {};

        this._logAppend(type, error.message, error.stack, {tags: tags, extra: extra});
        this._logSentry(type, error, tags, extra);

        lodash.defer(this.callback.call, "log", [type, error.message, error.stack]);
    },

    _logSentry: function(type, error, tags, extra) {
        if (!this.$data.useSentry) return;
        if (!lodash.includes(this.$data.levels, type)) return;
        if (type == "warn") type = "warning";

        error.message = error.message.replace(/\s*\|\s*/g, "\n | ");

        if (parseFloat(Sentry.VERSION) < 2) {
            extra.originalMessage = error.message;
        }

        if (this.$data.extraDataProvider) {
            extra = lodash.merge({}, this.$data.extraDataProvider(), extra);
        }

        const id = error.stack || error.message;

        if (!this.$data._caughtMessages[type]) {
            this.$data._caughtMessages[type] = {};
        }

        if (!this.$data._caughtMessages[type][id]) {
            this.$data._caughtMessages[type][id] = true;

            Sentry.captureException(error, {
                level: type,
                logger: "obsidian/debug",
                tags: tags,
                extra: extra
            });
        }
    },

    _logAppend: function(type, message, trace, data={}) {
        var lastLog = lodash.last(this.$data.logs);

        if (lastLog && lastLog.type == type && lastLog.message == message && lastLog.trace == trace) {
            lastLog.count += 1;
        } else {
            this.$data.logs.push({
                type: type,
                message: message,
                trace: trace,
                date: new Date().toJSON(),
                data: data,
                count: 1
            });
        }

        if (this.$data.logs.length > this.$data.MAX_LINES) {
            this.$data.logs.shift();
        }

    },

    _onConsoleLog: function(type, ...args) {
        this._log(type, ...args);
        this.$data["_console_" + type](...args);
    },

    _onUncaugthError: function(message, file, line, pos, error) {
        this._log("uncaught", error);
    }

});

module.exports = Debug;
