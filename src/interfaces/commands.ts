/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationCommandData, ChatInputCommandInteraction } from "discord.js";
import type Bot from "../classes/client";

export interface RunInterface {
    (client: Bot, interaction: ChatInputCommandInteraction): any;
}

export interface Command {
    run: RunInterface;
    interaction: ApplicationCommandData;
}
