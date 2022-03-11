// Développé par Léo Mercier 2022

if (parseInt(process.version.slice(1).split(".")[0]) < 17) throw new Error("[Error] Node 17 or higher is required. Update Node on your system !");

import "dotenv/config";
import Bot from "./classes/client";
import { connect } from "mongoose";

connect(process.env.DB_URL!).then(() => {
    new Bot().start();
}).catch(err => {
    throw new Error(`[Error] Database connection failed : ${err}`);
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const version: string = require(`${__dirname}/../package.json`).version;
