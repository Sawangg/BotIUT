import { MessageEmbed } from "discord.js";
import { RunInterface } from "../interfaces/commands";

export const run: RunInterface = async (_client, interaction) => {
    const abtmeEmbed = new MessageEmbed()
        .setDescription("💗 Dev par Léo Mercier • [Github](https://github.com/Sawangg/BotIUT)")
        .setColor("WHITE");
	return interaction.reply({ embeds: [abtmeEmbed], ephemeral: true });
}

export const interaction: Object = {
	name: "aboutme",
	usage: "aboutme",
	description: "Obtiens les informations sur le bot",
};