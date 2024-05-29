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
 */
declare class ConfigStorage {

    /**
     * @param keyName The name of the root key used to store the configuration (optional, default = "configStorage")
     * @param defaultConfigs An array object containing default values (optional, default = {}, the value in this object will NOT be saved)
     */
    constructor(keyName: string, defaultConfigs: object[]);

    /**
     * Get a configuration param.
     *
     * @param key The key to access (e.g. "language", "user.name")
     * @param defaultValue Any value returned if the requested key does not exist (optional, default: undefined)
     * @returns The value of the requested key
     */
    get(key: string, defaultValue?: unknown): unknown;

    /**
     * Set a configuration param.
     *
     * @param key The key to set (e.g. "language, "user.name")
     * @param value The value to set
     */
    set(key: string, value: unknown): void;

    /**
     * Clear all the configuration.
     */
    clear(): void;

    /**
     * Export configuration into a static object.
     */
    exportConfig(): object;
}

export default ConfigStorage;

