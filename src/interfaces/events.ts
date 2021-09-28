import { Bot } from "../classes/client";

export interface RunInterface {
    (client: Bot, ...args: any[]): Promise<any>,
}

export interface Event {
    name: string,
    run: RunInterface,
}