import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class Mode extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.command('mode_rem_background', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from.id });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(`*Режим изменен на удаление фона*`, { parse_mode: 'Markdown' });
        await database.update('user', { userId: ctx.from.id }, { mode: 'rem_background' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_background`)
      } catch (error) {
        logger.error(error);
      }
    })
    this.bot.command('mode_rem_text', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from.id });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(`*Режим изменен на удаление текста*`, { parse_mode: 'Markdown' });
        await database.update('user', { userId: ctx.from.id }, { mode: 'rem_text' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_text`)
      } catch (error) {
        logger.error(error);
      }
    })
    this.bot.command('mode_rem_logo', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from.id });
        if (!user) return;
        if (user.ban) return
        
        ctx.reply(`*Режим изменен на удаление логотипа*`, { parse_mode: 'Markdown' });
        await database.update('user', { userId: ctx.from.id }, { mode: 'rem_logo' });

        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} changed mode to rem_logo`)
      } catch (error) {
        logger.error(error);
      }
    })
  }
}