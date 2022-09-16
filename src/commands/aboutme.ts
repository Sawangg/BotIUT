import { ApplicationCommandData, EmbedBuilder } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = (_client, interaction) => {
    const abtmeEmbed = new EmbedBuilder()
        .setDescription(`💗 Dev par Léo Mercier ; Version ${version} • [Github](https://github.com/Sawangg/BotIUT)`)
        .setColor("White");
    return interaction.reply({ embeds: [abtmeEmbed], ephemeral: true });
};

export const interaction: ApplicationCommandData = {
    name: "aboutme",
    description: "Obtiens les informations sur le bot",
};
