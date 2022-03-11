import type { ApplicationCommandData, CommandInteraction } from "discord.js";
import type Bot from "../classes/client";

export interface RunInterface {
    (client: Bot, interaction: CommandInteraction): Promise<void> | void
}

export interface Command {
    run: RunInterface,
    interaction: ApplicationCommandData,
}
