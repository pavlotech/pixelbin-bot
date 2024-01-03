import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class Post extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.command('post', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from.id) })
        if (!user) return;
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from.username} tried using the /post`)

        ctx.scene.enter('post')
      } catch (error) {
        logger.error(error);
      }
    })
  }
}