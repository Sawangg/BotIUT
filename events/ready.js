const botconfig = require("../util/config.json");
const version = botconfig.version;

module.exports = async () => {

    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");
};