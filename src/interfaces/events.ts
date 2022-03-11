import type Bot from "../classes/client";

export interface RunInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client: Bot, ...args: Array<any>): Promise<void> | void,
}

export interface Event {
    name: string,
    run: RunInterface,
}
