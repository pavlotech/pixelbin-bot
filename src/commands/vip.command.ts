import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class Vip extends Command {
  constructor (bot: Telegraf<IBotContext>, prisma: any) {
    super(bot, prisma);
  }
  handle (logger: any): void {
    this.bot.command('vip', async (ctx) => {
      try {
        const currentUser = await this.prisma.user.findUnique({ where: { user_id: ctx.from.id } });
        console.log(currentUser);
        const updatedUser = await this.prisma.user.update({
          where: { user_id: ctx.from.id },
          data: { subscribe: currentUser.subscribe + 30 },
        });
        console.log(updatedUser);
      } catch (error) {
        logger.error(error);
      }
      await ctx.reply('vip +1', { parse_mode: 'Markdown' })
    })
  }
}