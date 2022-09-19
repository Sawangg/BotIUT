import {
    ApplicationCommandData,
    ApplicationCommandOptionType,
    ColorResolvable,
    EmbedBuilder,
    GuildChannel,
    PermissionsBitField,
} from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import edtConfig from "../database/schemas/Edt";
import { fetchEdt } from "../utils/edtFetcher";
import { version } from "../index";

export const run: RunInterface = async (client, interaction) => {
    if (interaction.options.getSubcommand() === "status") {
        const allEdt = await edtConfig.find();
        if (!allEdt.length) return interaction.reply({ content: "Aucun EDT trouvé !", ephemeral: true });
        let description = "**Role - Channel - EDT annee - Semaine - Envoie auto**\n\n";
        for (const edt of allEdt) {
            const channel = (await client.channels.fetch(edt.channelId)) as GuildChannel;
            const role = await channel.guild.roles.fetch(edt.roleId);
            description += `${role?.toString()} - ${channel?.toString()} - ${edt.edtName.toString()} - S${edt.week.toString()} - ${
                edt.currentlyFetching ? "Oui" : "Non"
            }\n`;
        }
        const embed = new EmbedBuilder()
            .setTitle("📅 Infos pour les **EDT** de ce serveur")
            .setDescription(description)
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}` as ColorResolvable)
            .setFooter({ text: `Version ${version} • Par Léo Mercier` });
        return interaction.reply({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand() === "add") {
        if (
            !interaction
                .guild!.members.cache.get(interaction.member!.user.id)
                ?.permissions.has(PermissionsBitField.Flags.Administrator)
        ) {
            const repEmbed = new EmbedBuilder()
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }

        const role = interaction.options.getRole("role")!;
        const channel = interaction.options.getChannel("chan")!;
        const edtName = interaction.options.getString("edtname")!;
        const week = interaction.options.getInteger("semaine")!;

        const roleAlreadyAffected = await edtConfig.find({ roleId: role.id });
        if (roleAlreadyAffected.length) {
            const repEmbed = new EmbedBuilder().setDescription("Ce rôle est déjà affecté à un EDT !").setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
        fetchEdt(client, role.id);
        await edtConfig.create({ roleId: role.id, channelId: channel.id, edtName, week, currentlyFetching: true });
        return interaction.reply("L'EDT a bien été ajouté !");
    }

    if (interaction.options.getSubcommand() === "remove") {
        if (
            !interaction
                .guild!.members.cache.get(interaction.member!.user.id)
                ?.permissions.has(PermissionsBitField.Flags.Administrator)
        ) {
            const repEmbed = new EmbedBuilder()
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }

        const role = interaction.options.getRole("role")!;
        const deleted = await edtConfig.findOneAndDelete({ roleId: role.id });
        if (!deleted) {
            const repEmbed = new EmbedBuilder().setDescription("Ce rôle n'est pas affecté à un EDT !").setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
        return interaction.reply("L'EDT a bien été supprimé !");
    }

    if (interaction.options.getSubcommand() === "enable") {
        if (
            !interaction
                .guild!.members.cache.get(interaction.member!.user.id)
                ?.permissions.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            const repEmbed = new EmbedBuilder()
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }

        const role = interaction.options.getRole("role")!;
        const edt = await edtConfig.findOneAndUpdate({ roleId: role.id }, { $set: { currentlyFetching: true } });
        if (!edt) {
            const repEmbed = new EmbedBuilder().setDescription("Ce rôle n'est pas affecté à un EDT !").setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
        fetchEdt(client, edt.roleId);
        return interaction.reply("L'envoie auto pour cet EDT a bien été activé !");
    }

    if (interaction.options.getSubcommand() === "disable") {
        if (
            !interaction
                .guild!.members.cache.get(interaction.member!.user.id)
                ?.permissions.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            const repEmbed = new EmbedBuilder()
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }

        const role = interaction.options.getRole("role")!;
        const updated = await edtConfig.findOneAndUpdate({ roleId: role.id }, { $set: { currentlyFetching: false } });
        if (!updated) {
            const repEmbed = new EmbedBuilder().setDescription("Ce rôle n'est pas affecté à un EDT !").setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
        // Disable here
        return interaction.reply("L'envoie auto pour cet EDT a bien été désactivé !");
    }
    return;
};

export const interaction: ApplicationCommandData = {
    name: "edt",
    description: "Configure l'envoie automatique d'un EDT",
    options: [
        {
            name: "status",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Affiche le status des EDT du serveur",
        },
        {
            name: "add",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Ajoute un EDT sur ce serveur",
            options: [
                {
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    description: "Le role a qui est affecté cet EDT",
                    required: true,
                },
                {
                    name: "chan",
                    type: ApplicationCommandOptionType.Channel,
                    description: "Le channel dans lequel cet EDT sera envoyé",
                    required: true,
                },
                {
                    name: "edtname",
                    type: ApplicationCommandOptionType.String,
                    description: "L'année dans l'URL du site de l'EDT (ex: A2)",
                    required: true,
                },
                {
                    name: "semaine",
                    type: ApplicationCommandOptionType.Integer,
                    description: "La dernière semaine disponible de l'EDT (ex: 4)",
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Supprime un EDT sur ce serveur",
            options: [
                {
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    description: "Le role a qui est affecté cet EDT",
                    required: true,
                },
            ],
        },
        {
            name: "enable",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Lance l'envoie automatique d'un EDT",
            options: [
                {
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    description: "Le role a qui est affecté cet EDT",
                    required: true,
                },
            ],
        },
        {
            name: "disable",
            type: ApplicationCommandOptionType.Subcommand,
            description: "Arrête l'envoie automatique d'un EDT",
            options: [
                {
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    description: "Le role a qui est affecté cet EDT",
                    required: true,
                },
            ],
        },
    ],
};
