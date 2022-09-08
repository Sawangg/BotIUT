import { ApplicationCommandData, ApplicationCommandOptionType, EmbedBuilder, TextChannel } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = (client, interaction) => {
    const reportedUser = interaction.options.getUser("user");
    if (!interaction.guildId || !interaction.member || !reportedUser) return;

    const guild = client.guilds.cache.get(interaction.guildId);
    if (!guild) return;

    const logs = guild.channels.cache.find((channel) => channel.id === process.env.LOGS);
    if (!logs) return;

    const reportLogsEmbed = new EmbedBuilder()
        .setDescription(
            `**Action :** Report\n**Membre :** ${interaction.member} (${
                interaction.member.user.id
            })\n**Reported :** ${reportedUser} (${reportedUser.id})\n**Channel :** ${interaction
                .guild!.channels.cache.get(interaction.channelId)
                ?.toString()}\n**Raison :** ${interaction.options.getString("reason")}`,
        )
        .setFooter({ text: `BotIUT v${version}` })
        .setColor("#4752C4")
        .setTimestamp();
    (logs as TextChannel)?.send({ embeds: [reportLogsEmbed] });

    const repEmbed = new EmbedBuilder().setDescription("Ton report a bien été envoyé !").setColor("White");
    return interaction.reply({ embeds: [repEmbed], ephemeral: true });
};

export const interaction: ApplicationCommandData = {
    name: "report",
    description: "Report un membre à la modération",
    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "Le membre que tu veux report",
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
