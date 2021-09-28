import { RunInterface } from "../../interfaces/events";
import { version } from "../../config.json";

export const run: RunInterface = async (_client) => {
    console.log("═════════════════════════════════════════════");
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");
};

export const name: string = "ready";