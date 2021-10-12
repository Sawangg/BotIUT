// Développé par Léo Mercier 2021

if (parseInt(process.version.slice(1).split(".")[0]) < 16) throw new Error("[Error] Node 16.0.0 or higher is required. Update Node on your system !");

import "dotenv/config";
import { Bot } from "./classes/client";

new Bot().start();