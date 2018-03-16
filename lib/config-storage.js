"use strict";

const lodash = require("lodash");

/**
 * Stores configuration.
 *
 * Example:
 *
 *     var dataStore1 = {...};
 *     var dataStore2 = {...};
 *
 *     var config = new ConfigStorage("myAppConfig", [dataStore1, dataStore2]);
 *
 * Resolution order:
 *
 *     * localConfig (from storage / defined by config.set())
 *     * dataStore2
 *     * dataStore1
 *     * defaultValue (passed as second argument of config.get())
 *
 *
 * @class obsidian-core.lib.config-storage
 */
class ConfigStorage {

    /**
     * @constructor
     * @param {String} keyName The name of the root key used to store the configuration (optional, default = "configStorage")
     * @param {[Object]} defaultConfigs An array object containing default values (optional, default = {}, the value in this object will NOT be saved)
     */
    constructor(keyName="configStorage", defaultConfigs=[]) {
        this._localConfig = {};
        this._keyName = keyName;
        this._defaultConfigs = lodash.merge({}, ...defaultConfigs);
        this._read();
    }

    /**
     * Get a configuration param.
     *
     * @method get
     * @param {String} key The key to access (e.g. "language", "user.name")
     * @param defaultValue Any value returned if the requested key does not exist (optional, default: undefined)
     * @return The value of the requested key
     */
    get(key, defaultValue) {
        var value = lodash.get(this._localConfig, key);
        if (value !== undefined) {
            return value;
        }
        return lodash.get(this._defaultConfigs, key, defaultValue);
    }

    /**
     * Set a configuration param.
     *
     * @method set
     * @chainable
     * @param {String} key The key to set (e.g. "language, "user.name")
     * @param value The value to set
     */
    set(key, value) {
        lodash.set(this._localConfig, key, value);
        lodash.defer(this._save.bind(this));
        return this;
    }

    /**
     * Clear all the configuration.
     *
     * @method clear
     */
    clear() {
        this._localConfig = {};
        lodash.defer(this._save.bind(this));
    }

    /**
     * Export configuration into a static object.
     *
     * @method exportConfig
     */
    exportConfig() {
        return lodash.merge({}, this._defaultConfigs, this._localConfig);
    }

    /**
     * Read the configuration from the localStorage.
     *
     * @method _read
     * @private
     */
    _read() {
        try {
            if (!localStorage[this._keyName]) {
                return;
            }
            this._localConfig = JSON.parse(localStorage[this._keyName]);
        } catch (error) {
            console.warn("Unable to read configuration from localStorage:", error);
        }
    }

    /**
     * Save the configuration to the localStorage.
     *
     * @method _save
     * @private
     */
    _save() {
        try {
            localStorage.setItem(this._keyName, JSON.stringify(this._localConfig));
        } catch (error) {
            console.warn("Unable to save configuration to localStorage:", error);
        }
    }

}

module.exports = ConfigStorage;
