import type { RunInterface } from "../../interfaces/events";
import { version } from "../../index";
import puppeteer from "puppeteer";
import { join } from "path";
import ejs from "ejs";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import type Bot from "../../classes/client";

export const run: RunInterface = async (client: Bot) => {
    console.log("═════════════════════════════════════════════");
    console.log(`[✔] BotIUT v${version} is connected !`);
    console.log("═════════════════════════════════════════════");

    const browser = await puppeteer.launch({
        args: ["--disable-web-security", "--disable-features=IsolateOrigins", "--disable-site-isolation-trials"],
    });
    const page = await browser.newPage();
    const url = "http://edt-iut-info.unilim.fr/edt/A2/A2_S4.pdf";
    const html = await ejs.renderFile(join(__dirname, "template.ejs"), { data: { url } });

    await page.setContent(html);
    await page.waitForNetworkIdle();
    const image = await page.screenshot({ encoding: "base64" });

    const guild = await client.guilds.fetch("421694325269856287");
    const channel = await guild.channels.fetch("530067094360948786");
    if (channel?.isTextBased()) {
        const attachment = new AttachmentBuilder(image, { name: "test.png" });
        const embed = new EmbedBuilder().setTitle("EDT").setImage(`attachment://${attachment.name}`);

        channel.send({ embeds: [embed], files: [attachment] });
    }
};

export const name = "ready";
