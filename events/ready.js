const botconfig = require("../util/config.json");
const version = botconfig.version;

module.exports = async (bot) => {

    console.log(`[Shards] Total of ${bot.shard.count} shards !`);
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");

};