const Discord = require("discord.js");
const botconfig = require("../util/config.json");
const version = botconfig.version;

module.exports = async (bot) => {

    console.log(`[Shards] Total of ${bot.shard.count} shards !`);
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log(`═════════════════════════════════════════════`);

    function randomIntInc (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    let rnd = randomIntInc(1, 2);

    // Status

    function status() {
        switch (rnd) {
            case 1:
                bot.user.setActivity("@BotIUT help 📝!", { type: 'WATCHING' });
                bot.user.setStatus("dnd");
                break;
            case 2: 
                bot.user.setActivity("💗 Dev par Sawang_", { type: 'WATCHING' });
                bot.user.setStatus("idle");
                break;
            default:
                bot.user.setActivity("@BotIUT help 📝!", { type: 'WATCHING' });
                bot.user.setStatus("dnd");
                break;
        }
    } setInterval(status, 30000);
};