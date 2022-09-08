import { ApplicationCommandData, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import userConfig from "../database/schemas/User";
import { version } from "../index";

export const run: RunInterface = async (_client, interaction) => {
    const user = interaction.options.getUser("user")!;

    if (!user) {
        let row = await userConfig.findOne({ id: interaction.user.id });
        if (!row) row = await userConfig.create({ id: interaction.user.id });

        const repEmbed = new EmbedBuilder()
            .setDescription(
                `✨ Info de niveau pour \`${interaction.user.tag}\`
            \n**Niveau :** ${row.lvl}\n**Expérience :** ${row.xp}`,
            )
            .setFooter({ text: `BotIUT v${version}` })
            .setColor("White")
            .setTimestamp();
        interaction.reply({ embeds: [repEmbed] });
    } else {
        let row = await userConfig.findOne({ id: user.id });
        if (!row) row = await userConfig.create({ id: user.id });

        const repEmbed = new EmbedBuilder()
            .setDescription(
                `✨ Info de niveau pour \`${user.tag}\`
            \n**Niveau :** ${row.lvl}\n**Expérience :** ${row.xp}`,
            )
            .setFooter({ text: `BotIUT v${version}` })
            .setColor("White")
            .setTimestamp();
        interaction.reply({ embeds: [repEmbed] });
    }
};

export const interaction: ApplicationCommandData = {
    name: "level",
    description: "Obtiens les informations de niveau d'un utilisateur",
    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "L'utilisateur",
            required: false,
        },
    ],
};
