import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { Bot } from "../classes/client";

export interface RunInterface {
    (client: Bot, interaction: CommandInteraction): Promise<void>
}

export interface Command {
    run: RunInterface,
    interaction: ApplicationCommandData,
}