import Class from "abitbol";

/**
 * A generic 60 Hz loop.
 */
declare class Mainloop extends Class {

    __init__(params: unknown): void;

    /**
     * The callbacks
     */
    get callbacks(): CallableFunction[];

    set callbacks(value: CallableFunction[]);

    getCallbacks(): CallableFunction[];

    setCallbacks(value: CallableFunction[]): void;

    /**
     * Start the loop.
     */
    start(): void;

    /**
     * Stop the loop.
     */
    stop(): void;

    /**
     * Add a callback.
     *
     * @param callback
     */
    addCallback(callback: CallableFunction): void;

    /**
     * Remove a callback.
     *
     * @param callback
     */
    removeCallback(callback: CallableFunction): void;
}

export default Mainloop;
