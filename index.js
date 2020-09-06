// Développer par Léo Mercier 2020

if (process.version.slice(1).split(".")[0] < 12) throw new Error("[Error] Node 12.0.0 or higher is required. Update Node on your system !");

const Discord = require("discord.js");
const tokenconf = require("./util/api/token.json");

console.clear();
console.log("═════════════════════════════════════════════");

const manager = new Discord.ShardingManager("./util/app.js", {
    token: tokenconf.token,
    totalShards: "auto",
    endShard: "auto",
    respawn: true,
});

manager.spawn();