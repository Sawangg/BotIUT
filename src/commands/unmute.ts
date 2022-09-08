import {
    ApplicationCommandData,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = async (client, interaction) => {
    const member = await client.guilds.cache
        .get(interaction.guildId!)!
        .members.fetch(interaction.options.getUser("user")!);
    const reason = interaction.options.getString("reason")! ?? "Aucune raison";
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

    const mutedMember = interaction.guild.members.cache.get(member.id);
    if (
        !mutedMember ||
        mutedMember?.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
        interaction.member.user.id === member.id ||
        client.user!.id === member.id
    ) {
        const repEmbed = new EmbedBuilder()
            .setDescription("Cette utilisateur ne peut pas être unmute !")
            .setColor("Red");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    return member
        .timeout(0, reason)
        .then(() => {
            const repEmbed = new EmbedBuilder().setDescription("La personne a bien été unmute !").setColor("Green");
            interaction.reply({ embeds: [repEmbed], ephemeral: true });

            const logs = interaction.guild!.channels.cache.find((channel) => channel.id === process.env.LOGS);

            const unmuteLogsEmbed = new EmbedBuilder()
                .setDescription(
                    `**Action :** Unmute\n**Modérateur :** ${interaction.member} (${
                        interaction.member!.user.id
                    })\n**Membre :** ${member} (${member.id})\n**Channel :** ${interaction
                        .guild!.channels.cache.get(interaction.channelId)
                        ?.toString()}\n**Raison :** ${
                        interaction.options.getString("reason")
                            ? interaction.options.getString("reason")
                            : "Aucune raison spécifiée"
                    }`,
                )
                .setFooter({ text: `BotIUT v${version}` })
                .setColor("#A3FF84")
                .setTimestamp();
            return (logs as TextChannel)?.send({ embeds: [unmuteLogsEmbed] });
        })
        .catch(() => {
            const repEmbed = new EmbedBuilder().setDescription("Une erreur fatale est survenue !").setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        });
};

export const interaction: ApplicationCommandData = {
    name: "unmute",
    description: "Unmute un membre du serveur",
    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "Le membre que tu veux unmute",
            required: true,
        },
        {
            name: "reason",
            type: ApplicationCommandOptionType.String,
            description: "La raison de l'unmute",
            required: false,
        },
    ],
};
