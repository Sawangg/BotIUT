import type { RunInterface } from "../../interfaces/events";
// import edtConfig from "../../database/schemas/Edt";
// import { fetchEdt } from "../../utils/edtFetcher";
// import type Bot from "../../classes/client";
import { version } from "../../index";

export const run: RunInterface = async (/*client: Bot*/) => {
    console.log("═════════════════════════════════════════════");
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");

    // const allEdt = await edtConfig.find();
    // allEdt.forEach((edt) => {
    //     if (edt.currentlyFetching) fetchEdt(client, edt.roleId);
    // });
};

export const name = "ready";
