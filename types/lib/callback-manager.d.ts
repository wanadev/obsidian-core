interface Callback {
    id: string;
    cb: CallableFunction;
    opt: object;
}

interface CallbackOptions {
    id?: string;
    [key: string]: unknown;
}

declare class CallbackManager {
    constructor(...evNames: string[]);

    get callbacks(): { [evName: string]: Callback[] };

    get defaultOptions(): CallbackOptions;

    set defaultOptions(value: CallbackOptions);

    /**
     * Add a new authorized evName.
     */
    addEvName(...evNames: string[]): void;

    /**
     * Register a callback.
     *
     *     .add("draw", function() {});
     *     .add("draw", {id: "foobar"}, function() {});
     */
    add(evName: string, callback: CallableFunction): string;

    add(evName: string, options: CallbackOptions, callback: CallableFunction): string;

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
     */
    call(evName: string, args?: unknown[], options?: object): void;


    /**
     * Unregister a callback.
     */
    remove(id: string): void;


    /**
     * Stop the call of the callback stack for the current event.
     * (equivalent to Javascript's event.stopPropagation() )
     */
    stop(): void;
}

export default CallbackManager;
