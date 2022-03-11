import type { RunInterface } from "../../interfaces/events";
import { version } from "../../index";

export const run: RunInterface = () => {
    console.log("═════════════════════════════════════════════");
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");
};

export const name = "ready";
