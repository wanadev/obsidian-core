import Class from "abitbol";
import type CallbackManager from "./callback-manager";

interface Log {
    type: string;
    message: string;
    trace: string;
    date: string;
    data: object;
    count: number;
}

/**
 * This class handle and log all logs (console.log|info|warn|error) and uncaught errors.
 */
export class Debug extends Class {

    __init__(): void;

    /**
     * Callback Manager
     *
     *     "log" -> function(type, message, trace) {}
     */
    callback: CallbackManager;

    /**
     * Raw logs.
     */
    get logs(): Log[];

    getLogs(): Log[];

    /**
     * A function returning extra data to pass to sentry.
     */
    get extraDataProvider(): () => object;

    set extraDataProvider(value: () => object);

    getExtraDataProvider(): () => object;

    setExtraDataProvider(value: () => object): void;

    /**
     * Extra tags to pass to sentry.
     */
    get extraTags(): object;

    set extraTags(value: object);

    getExtraTags(): object;

    setExtraTags(value: object): void;

    /**
     * Clear logs.
     */
    clearLogs(): void;
}

export default Debug;
