import { ApplicationCommandData, MessageEmbed } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import userConfig from "../database/schemas/User";
import { version } from "../index";

export const run: RunInterface = async (_client, interaction) => {
    if (!interaction.guild || !interaction.channel || !interaction.member) return;
    const row = await userConfig.find({}).sort({ xp: -1 });

    if (row.length < 3) {
        const repEmbed = new MessageEmbed()
            .setDescription("Il faut au minimum 3 membres pour effectuer un classement !")
            .setColor("RED");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    const repEmbed = new MessageEmbed()
        .setDescription(`✨ Classement du serveur :
        \n1. ${(await interaction.guild.members.fetch(row[0].id)).toString()}: ${row[0].lvl} lvl (${row[0].xp}xp)\n2. ${(await interaction.guild.members.fetch(row[1].id)).toString()}: ${row[1].lvl} lvl (${row[1].xp}xp)\n3. ${(await interaction.guild.members.fetch(row[2].id)).toString()}: ${row[2].lvl} lvl (${row[2].xp}xp)`)
        .setFooter(`BotIUT v${version}`)
        .setColor("WHITE")
        .setTimestamp();
    interaction.reply({ embeds: [repEmbed] });
};

export const interaction: ApplicationCommandData = {
    name: "rank",
    description: "Obtiens le classement de niveaux du serveur",
};
