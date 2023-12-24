import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Response } from "../types/response.class";

export class Start extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.start(async (ctx) => {
      try {
        await ctx.reply(new Response().start(), { parse_mode: 'Markdown' });
        
        if (!await database.findUnique('user', { user_id: ctx.from.id })) {
          const user = await database.create('user', {
            user_id: ctx.from.id,
            registry: Date.now(),
            subscribe: 0,
            mode: 'default',
            lastPay: 0
          })
          logger.log(user)
          logger.log(`User: ${ctx.from.username} saved`);
        }        
      } catch (error) {
        logger.error(error)
      }
    })
  }
}