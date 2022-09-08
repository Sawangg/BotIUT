/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChatInputCommandInteraction } from "discord.js";
import type Bot from "../classes/client";

export interface RunInterface {
    (client: Bot, interaction: ChatInputCommandInteraction): any;
}
