import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { mode } from "../../settings";

export class Mode extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.command('mode_rem_background', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from.id) });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(mode.rem_background, { parse_mode: 'Markdown' });
        await database.update('user', { userId: String(ctx.from.id) }, { mode: 'rem_background' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_background`)
      } catch (error) {
        logger.error(error);
      }
    })
    this.bot.command('mode_rem_text', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from.id) });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(mode.rem_text, { parse_mode: 'Markdown' });
        await database.update('user', { userId: String(ctx.from.id) }, { mode: 'rem_text' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_text`)
      } catch (error) {
        logger.error(error);
      }
    })
    this.bot.command('mode_rem_logo', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from.id) });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(mode.rem_logo, { parse_mode: 'Markdown' });
        await database.update('user', { userId: String(ctx.from.id) }, { mode: 'rem_logo' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_logo`)
      } catch (error) {
        logger.error(error);
      }
    })
  }
}