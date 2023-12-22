import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class Mode extends Command {
  constructor (bot: Telegraf<IBotContext>, prisma: any) {
    super(bot, prisma);
  }
  handle (logger: any): void {
    
  }
}