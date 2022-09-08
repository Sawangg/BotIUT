import {
    ApplicationCommandData,
    ApplicationCommandOptionType,
    EmbedBuilder,
    Message,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = async (_client, interaction) => {
    if (!interaction.guild || !interaction.member) return;

    if (
        !interaction.guild.members.cache
            .get(interaction.member.user.id)
            ?.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
        const repEmbed = new EmbedBuilder()
            .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            .setColor("Red");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    const channel = await interaction.channel?.fetch();
    return (channel as TextChannel).messages
        .fetch(interaction.options.getString("msg")!)
        .then((message: Message) => {
            if (!interaction.guild || !interaction.member) return;
            const logs = interaction.guild.channels.cache.find((c) => c.id === process.env.LOGS);

            const muteLogsEmbed = new EmbedBuilder()
                .setDescription(
                    `**Action :** Suppression de message (Clean)\n**Modérateur :** ${interaction.member} (${
                        interaction.member.user.id
                    })\n**Membre :** ${message.author} (${
                        message.author.id
                    })\n**Channel :** ${interaction.guild.channels.cache.get(interaction.channelId)?.toString()} (${
                        message.channelId
                    })\n**Message :** ${message.content}\n**Raison :** ${interaction.options.getString("raison")}`,
                )
                .setFooter({ text: `BotIUT v${version}` })
                .setColor("#DB3E79")
                .setTimestamp();

            try {
                message.delete();
            } catch {
                const repEmbed = new EmbedBuilder()
                    .setDescription("Le message n'a pas pu être supprimé !")
                    .setColor("Red");
                return interaction.reply({ embeds: [repEmbed], ephemeral: true });
            }
            (logs as TextChannel)?.send({ embeds: [muteLogsEmbed] });

            const repEmbed = new EmbedBuilder().setDescription("Le message a bien été supprimé !").setColor("Green");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        })
        .catch(() => {
            const repEmbed = new EmbedBuilder()
                .setDescription(
                    "Le message n'a pas pu être trouvé !\nVérifies l'id et execute cette commande dans le même channel que le message que tu veux suppimer.",
                )
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        });
};

export const interaction: ApplicationCommandData = {
    name: "clean",
    description: "Supprime un message",
    options: [
        {
            name: "msg",
            type: ApplicationCommandOptionType.String,
            description: "L'id du message a supprimer",
            required: true,
        },
        {
            name: "raison",
            type: ApplicationCommandOptionType.String,
            description: "La raison du report",
            required: true,
        },
    ],
};
