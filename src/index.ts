// Développé par Léo Mercier 2021

if (parseInt(process.version.slice(1).split(".")[0]) < 17) throw new Error("[Error] Node 17 or higher is required. Update Node on your system !");

import "dotenv/config";
import Bot from "./classes/client";
import { connect } from "mongoose";

connect(process.env.DB_URL!).then(() => {
    new Bot().start();
}).catch(err => {
    throw new Error(`[Error] Database connection failed : ${err}`);
});
