import { ApplicationCommandData, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import type { RunInterface } from "../interfaces/commands";

export const run: RunInterface = async (_client, interaction) => {
    if (!interaction.guild || !interaction.channel || !interaction.member) return;
    let member = interaction.guild!.members.cache.get(interaction.member.user.id);
    if (!member) member = await interaction.guild.members.fetch(interaction.member.user.id);

    try {
        if (
            member.permissions.has(PermissionsBitField.Flags.ManageMessages) ||
            member.roles.cache.has(process.env.DELEGUEID!) ||
            member.roles.cache.has(process.env.OEILID!)
        ) {
            await interaction.channel.messages.pin(interaction.options.getString("msg")!);

            const repEmbed = new EmbedBuilder()
                .setDescription(`Le message a été épinglé par ${interaction.member.toString()} !`)
                .setColor("Green");
            return interaction.reply({ embeds: [repEmbed] });
        } else {
            const repEmbed = new EmbedBuilder()
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                .setColor("Red");
            return interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
    } catch {
        const repEmbed = new EmbedBuilder()
            .setDescription("Une erreur est survenue et le message n'a pas été épinglé !")
            .setColor("Red");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }
};

export const interaction: ApplicationCommandData = {
    name: "pin",
    description: "Pin un message",
    options: [
        {
            name: "msg",
            type: ApplicationCommandOptionType.String,
            description: "L'id du message à pin",
            required: true,
        },
    ],
};
