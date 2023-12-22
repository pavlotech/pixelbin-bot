import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Response } from "../types/response.class";

export class Start extends Command {
  constructor (bot: Telegraf<IBotContext>, prisma: any) {
    super(bot, prisma);
  }
  handle (logger: any): void {
    this.bot.start(async (ctx) => {
      await ctx.reply(new Response().start(), { parse_mode: 'Markdown' });
      if (!await this.prisma.user.findUnique({ where: { user_id: ctx.from.id } })) {
        await this.prisma.user.create({
          data: {
            user_id: ctx.from.id,
            registry: Date.now(),
            subscribe: 0,
            mode: 'default',
            lastPay: 0,
            rules: 'user'
          }
        })
        logger.log(`User: ${ctx.from.username} saved`);
      }
      logger.log(await this.prisma.user.findUnique({ where: { user_id: ctx.from.id } }))
      logger.log(await this.prisma.user.update({ where: { user_id: ctx.from.id }, data: { subscribe: +1 } }))
    })
  }
}