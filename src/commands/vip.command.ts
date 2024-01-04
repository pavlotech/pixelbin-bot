import { Telegraf, Context } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { tinkoffPAY } from "../types/tinkoff.class";
import { IConfigService } from "../config/config.interface";
import { vip } from "../../settings";

export class Vip extends Command {
  constructor(bot: Telegraf<IBotContext>, private readonly config: IConfigService) {
    super(bot);
  }
  handle(logger: any, database: any): void {
    this.bot.command('vip', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from.id) });
        if (!user) return;
        if (user.ban) return;
        ctx.reply(vip.firstMessage, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Купить", callback_data: 'buy' }]
            ]
          },
          parse_mode: 'Markdown'
        });
        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} use /vip`)
      } catch (error) {
        logger.error(error);
      }
    });
    this.bot.action('buy', async (ctx) => {
      try {
        ctx.scene.enter('get_email')
      } catch (error) {
        logger.error(error)
      }
    })
  }
}
