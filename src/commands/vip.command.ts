import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class Vip extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.command('vip', async (ctx) => {
      try {
        const currentUser = await database.findUnique('user', { user_id: ctx.from.id } );
        logger.log(currentUser);
        const updatedUser = await database.update('user',
          { user_id: ctx.from.id },
          { subscribe: currentUser.subscribe + 30 }
        );
        logger.log(updatedUser);
      } catch (error) {
        logger.error(error);
      }
      await ctx.reply('vip +30', { parse_mode: 'Markdown' })
    })
  }
}