import { ApplicationCommandData, MessageEmbed, Permissions, TextChannel } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import userConfig from "../database/schemas/User";
import { version } from "../index";

export const run: RunInterface = async (client, interaction) => {
    const warnedUser = interaction.options.getUser("user")!;
    if (!interaction.guild || !interaction.member) return;

    if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        const repEmbed = new MessageEmbed()
            .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            .setColor("RED");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    const warnedMember = interaction.guild.members.cache.get(warnedUser.id);
    if (!warnedMember || warnedMember?.permissions.has(Permissions.FLAGS.BAN_MEMBERS) || interaction.member.user.id === warnedUser.id || client.user!.id === warnedUser.id) {
        const repEmbed = new MessageEmbed()
            .setDescription("Cette utilisateur ne peut pas être warn !")
            .setColor("RED");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    let row = await userConfig.findOneAndUpdate({ id: warnedUser.id }, { $inc: { warn: 1 } });
    if (!row) row = await userConfig.create({ id: warnedUser.id, warn: 1 });

    const userRepEmbed = new MessageEmbed()
        .setDescription("Tu as été warn par la modération du server ! Si tu obtiens d'autres warn, la sanction pourra s'avérer plus sévère !")
        .setColor("RED");
    await warnedUser.send({ embeds: [userRepEmbed] });

    const repEmbed = new MessageEmbed()
        .setDescription("La personne a bien été warn !")
        .setColor("GREEN");
    interaction.reply({ embeds: [repEmbed], ephemeral: true });

    const logs = interaction.guild.channels.cache.find(channel => channel.id === process.env.LOGS);

    const warnLogsEmbed = new MessageEmbed()
        .setDescription(`**Action :** Warn\n**Modérateur :** ${interaction.member} (${interaction.member.user.id})\n**Membre :** ${warnedUser} (${warnedUser.id})\n**Nombre d'offense(s) :** ${row.warn}\n**Channel :** ${interaction.guild.channels.cache.get(interaction.channelId)?.toString()}\n**Raison :** ${interaction.options.getString("raison")}`)
        .setFooter(`BotIUT v${version}`)
        .setColor("#ffDC5C")
        .setTimestamp();
    (logs as TextChannel)?.send({ embeds: [warnLogsEmbed] });
};

export const interaction: ApplicationCommandData = {
    name: "warn",
    description: "Warn un membre du serveur",
    /* Permissions: [
        {
            id: process.env.MODID,
            type: "ROLE",
            permission: true
        }
    ],*/
    options: [
        {
            name: "user",
            type: "USER",
            description: "Le membre que tu veux warn",
            required: true,
        },
        {
            name: "raison",
            type: "STRING",
            description: "La raison du warn",
            required: true,
        },
    ],
};
