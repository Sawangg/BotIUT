import { ApplicationCommandData, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } from "discord.js";
import type { RunInterface } from "../interfaces/commands";

export const run: RunInterface = async (_client, interaction) => {
    if (!interaction.guild || !interaction.channel || !interaction.member) return;

    try {
        if (
            !interaction
                .guild!.members.cache.get(interaction.member.user.id)
                ?.permissions.has(PermissionsBitField.Flags.ManageMessages)
        ) {
            if (
                !interaction
                    .guild!.members.cache.get(interaction.member.user.id)
                    ?.roles.cache.has(process.env.DELEGUEID!)
            ) {
                const repEmbed = new EmbedBuilder()
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                    .setColor("Red");
                return interaction.reply({ embeds: [repEmbed], ephemeral: true });
            }
        }

        await interaction.channel.messages.unpin(interaction.options.getString("msg")!);

        const repEmbed = new EmbedBuilder()
            .setDescription(`Le message a été désépinglé par ${interaction.member.toString()} !`)
            .setColor("Green");
        return interaction.reply({ embeds: [repEmbed] });
    } catch {
        const repEmbed = new EmbedBuilder()
            .setDescription("Une erreur est survenue et le message n'a pas été désépinglé !")
            .setColor("Red");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }
};

export const interaction: ApplicationCommandData = {
    name: "unpin",
    description: "Unpin un message",
    options: [
        {
            name: "msg",
            type: ApplicationCommandOptionType.String,
            description: "L'id du message à unpin",
            required: true,
        },
    ],
};
