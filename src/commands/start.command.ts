import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { IConfigService } from "../config/config.interface";
import { start } from '../../settings'

export class Start extends Command {
  constructor (bot: Telegraf<IBotContext>, private readonly config: IConfigService) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.start(async (ctx) => {
      try {
        async function createUser () {
          await database.create('user', {
            userId: String(ctx.from.id),
            registry: `${Date.now()}`,
            subscribe: 0,
            mode: 'rem_background',
            lastPay: '0',
            admin: false,
            ban: false,
            banDate: '0'
          })
          logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} saved`);
        }
        const user = await database.findUnique('user', { userId: String(ctx.from.id) });
        if (user.ban) return;
        await ctx.replyWithPhoto(
          { source: 'start-image.jpg' },
          {
            caption: start.firstMessage,
            parse_mode: 'Markdown'
          }
        );
        async function reply () {
          await new Promise(resolve => setTimeout(resolve, 250));
          ctx.reply(start.secondMessage, { parse_mode: 'Markdown' });
        }
        if (!user || user.subscribe <= 0) {
          await reply()
        }
        if (!user) {
          await createUser()
        }
        const urlData = ctx.message.text.split(' ')[1]
        if (urlData) {
          if (await database.findUnique('user', { userId: String(ctx.from.id) }).ban) return;
          const data = await database.findUnique('password', { password: urlData })
          if (data) {
            ctx.reply(`*Вам выданы права администратора*`, { parse_mode: 'Markdown' })
            await database.update('user', { userId: String(ctx.from.id)}, { admin: true })
            await database.delete('password', { id: data.id })

            const users = await database.findMany('user')
            const adminUsers = users.filter((user: { admin: boolean; }) => user.admin === true);

            adminUsers.forEach((user: { userId: any; }) => {
              ctx.telegram.sendMessage(user.userId, `*ID:* \`${ctx.from.id}\` *Получил права администратора*`, { parse_mode: 'Markdown' })
            });
            logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} got administrator rights`)
          } else {
            logger.warn(`${ctx.from.id} - https://t.me/${ctx.from.username} attempt to obtain admin rights using an outdated link`)
          }
        }
        logger.info(`${ctx.from.id} - https://t.me/${ctx.from.username} use /start`)
      } catch (error) {
        logger.error(error)
      }
    })
  }
}