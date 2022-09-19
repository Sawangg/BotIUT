import { AttachmentBuilder, ColorResolvable, EmbedBuilder, GuildChannel, Snowflake } from "discord.js";
import type Bot from "../classes/client";
import { version } from "../index";
import puppeteer from "puppeteer";
import edtConfig from "../database/schemas/Edt";
import { join } from "path";
import ejs from "ejs";

export const fetchEdt = (client: Bot, roleId: Snowflake) => {
    setInterval(async () => {
        const edt = await edtConfig.findOne({ roleId });
        if (!edt) throw new Error("No EDT found inside interval");

        fetch(`http://edt-iut-info.unilim.fr/edt/${edt.edtName}/${edt.edtName}_S${edt.week.toString()}.pdf`)
            .then(async (response) => {
                if (response.status === 200) {
                    const browser = await puppeteer.launch({
                        executablePath: process.platform !== "win32" ? "/usr/bin/chromium-browser" : undefined,
                        defaultViewport: {
                            width: 1920,
                            height: 1080,
                        },
                        args: [
                            "--no-sandbox",
                            "--disable-web-security",
                            "--disable-features=IsolateOrigins",
                            "--disable-site-isolation-trials",
                            "--window-size=1920,1080",
                        ],
                    });
                    const page = await browser.newPage();
                    const html = await ejs.renderFile(join(__dirname, "pdf.ejs"), {
                        data: { url: response.url },
                    });
                    await page.setContent(html);
                    await page.waitForNetworkIdle();
                    const image = await page.screenshot({
                        type: "png",
                        encoding: "base64",
                        clip: {
                            x: 85,
                            y: 94,
                            width: 1685,
                            height: 890,
                        },
                    });
                    await browser.close();
                    const channel = (await client.channels.fetch(edt.channelId)) as GuildChannel;
                    const role = await channel.guild.roles.fetch(roleId)!;

                    if (channel?.isTextBased() && role) {
                        const attachment = new AttachmentBuilder(Buffer.from(image.toString(), "base64"), {
                            name: "edt.png",
                        });

                        const embed = new EmbedBuilder()
                            .setTitle(`_Nouveau EDT pour la semaine_ **S${edt.week.toString()}** _detecté_`)
                            .setDescription(`Disponible [ici](${response.url}) !`)
                            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}` as ColorResolvable)
                            .setImage(`attachment://${attachment.name}`)
                            .setFooter({ text: `Version ${version} 🚀` });
                        channel.send({
                            content: role.toString(),
                            embeds: [embed],
                            files: [attachment],
                            allowedMentions: { parse: ["roles"] },
                        });

                        await edtConfig.findOneAndUpdate({ roleId: role.id }, { $inc: { week: 1 } });
                    }
                }
            })
            .catch((err) => {
                // TODO: Kill if fatal error
                console.error(
                    `Failed to fetch the calendar for year ${edt.edtName} at S${edt.week.toString()} : \n${err}`,
                );
            });
    }, 10000);
};
