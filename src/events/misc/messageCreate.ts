/* eslint-disable no-useless-escape */
import { ApplicationCommandData, EmbedBuilder, Message, PermissionsBitField, TextChannel } from "discord.js";
import type { RunInterface } from "../../interfaces/events";
import { version } from "../../index";
import type { Command } from "../../interfaces/commands";
import userConfig from "../../database/schemas/User";

export const run: RunInterface = async (client, message: Message) => {
    if (!message.guild || message.author.bot) return;

    /* Register slash commands to the server */
    if (
        message.member?.permissions.has(PermissionsBitField.Flags.Administrator) &&
        message.content.toLowerCase() === "!register"
    ) {
        const commandsData: Array<ApplicationCommandData> = [];
        client.commands.forEach((value: Command) => commandsData.push(value.interaction));
        try {
            const fetchedGuild = await client.guilds.fetch(message.guild.id);
            fetchedGuild.commands.set(commandsData);
            message.channel.send("Commandes slashs enregistrées !");
        } catch {
            message.channel.send("Une erreur est survenu lors de l'enregistrement des commandes slashs !");
        }
    }

    // XP system
    let row = await userConfig.findOneAndUpdate({ id: message.author.id }, { $inc: { xp: 1 } });
    if (!row) row = await userConfig.create({ id: message.author.id, xp: 1 });

    if (message.member?.premiumSince) {
        const xpNeededToLvlUp = 6 * (row.lvl ^ 2) + 50 * row.lvl + 75;
        if (row.xp >= xpNeededToLvlUp)
            await userConfig.findOneAndUpdate({ id: message.author.id }, { $inc: { lvl: 1 } });
    } else {
        const xpNeededToLvlUp = 7 * (row.lvl ^ 2) + 50 * row.lvl + 75;
        if (row.xp >= xpNeededToLvlUp)
            await userConfig.findOneAndUpdate({ id: message.author.id }, { $inc: { lvl: 1 } });
    }

    const logs = message.guild.channels.cache.find((channel) => channel.id === process.env.LOGS);
    if (!logs) return;

    /* Remove free Nitro scam */
    if (message.content.toLowerCase().includes("nitro") && message.content.toLowerCase().includes("free")) {
        if (
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi.test(
                message.content,
            )
        ) {
            const freeNitroEmb = new EmbedBuilder()
                .setDescription(
                    `**Action :** Suppression d'un message\n**Membre :** <@${message.author.id}> (${message.author.id})\n**Channel :** <#${message.channelId}>\n**Raison :** Suspicion de message dangereux (phishing)\n**Contenu :** ${message.content}`,
                )
                .setFooter({ text: `BotIUT v${version}` })
                .setColor("#FF3232")
                .setTimestamp();
            (logs as TextChannel)?.send({ embeds: [freeNitroEmb] });
            message.delete();
        }
    }

    /* Remove discord invite */
    if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        if (/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)) {
            const delInvEmb = new EmbedBuilder()
                .setDescription(
                    `**Action :** Suppression d'un message\n**Membre :** <@${message.author.id}> (${message.author.id})\n**Channel :** <#${message.channelId}>\n**Raison :** Invitation discord\n**Contenu :** ${message.content}`,
                )
                .setFooter({ text: `BotIUT v${version}` })
                .setColor("#FF4C4C")
                .setTimestamp();
            (logs as TextChannel)?.send({ embeds: [delInvEmb] });
            message.delete();
        }
    }

    /* Remove shortcut link */
    if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        if (
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?(?:bit|rb|shorturl|adf|tinyurl)+|(?:www\.|[\-;:&=\+\$,\w]+@)(?:bit|rb|shorturl|adf|tinyurl)+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi.test(
                message.content,
            )
        ) {
            const delShortLinkEmb = new EmbedBuilder()
                .setDescription(
                    `**Action :** Suppression d'un message\n**Membre :** <@${message.author.id}> (${message.author.id})\n**Channel :** <#${message.channelId}>\n**Raison :** Suspicion de short link\n**Contenu :** ${message.content}`,
                )
                .setFooter({ text: `BotIUT v${version}` })
                .setColor("#E7A854")
                .setTimestamp();
            (logs as TextChannel)?.send({ embeds: [delShortLinkEmb] });
            message.delete();
        }
    }
};

export const name = "messageCreate";
