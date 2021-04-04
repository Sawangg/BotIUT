// Développé par Léo Mercier 2021

if (process.version.slice(1).split(".")[0] < 12) throw new Error("[Error] Node 14.0.0 or higher is required. Update Node on your system !");

require("dotenv").config();
const { ShardingManager } = require("discord.js");

console.clear();
console.log("═════════════════════════════════════════════");

const manager = new ShardingManager("./util/app.js", {
    token: process.env.TOKEN,
    totalShards: "auto",
    endShard: "auto",
    respawn: true,
});

manager.spawn();