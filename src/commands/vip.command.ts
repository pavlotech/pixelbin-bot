import { Telegraf, Context } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { tinkoffPAY } from "../types/tinkoff.class";
import { IConfigService } from "../config/config.interface";

export class Vip extends Command {
  private priceVIP = 490;
  private tokenAdd = 30;
  private tinkoff: tinkoffPAY;

  private editMessageIds: Map<number, number | null> = new Map<number, number | null>();
  private paymentIds: Map<number, string | null> = new Map<number, string | null>();
  private paymentStatuses: Map<number, boolean | null> = new Map<number, boolean | null>();

  constructor(bot: Telegraf<IBotContext>, private readonly config: IConfigService) {
    super(bot);
    this.tinkoff = new tinkoffPAY(this.config.get('SHOP_ID'), this.config.get('SECRET_KEY'));
  }

  handle(logger: any, database: any): void {
    this.bot.command('vip', async (ctx) => {
      try {
        ctx.reply(`
Подписка дает 30 обработок изображений в сумме. 

Стоимость: 490 руб

Чтобы купить нажмите на кнопку ниже
        `, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Купить", callback_data: 'buy' }]
            ]
          },
          parse_mode: 'Markdown'
        });
      } catch (error) {
        logger.error(error);
      }
    });

    this.bot.action('buy', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from?.id });
        if (user.ban) return;

        let numPay = user.lastPay / 1 + 1;
        if (isNaN(numPay)) {
          numPay = +new Date();
        }
        const Amount = this.priceVIP * 100;

        this.tinkoff.createInvoice({
          Amount: Amount,
          OrderId: `px_01_${numPay}_${ctx.from?.id}`,
          Description: "VIP-подписка MidJourney-бот.",
        }, {
          Email: "pixelbintelegram@mail.ru",
          Taxation: "usn_income",
          Items: [
            {
              Name: `mjoj${this.priceVIP}`,
              Quantity: 1,
              Price: Amount,
              Amount: Amount,
              Tax: "vat20",
            },
          ]
        }).then(async (invoice: any) => {
          const messageText = `
После оплаты нажмите на кнопку 'Я оплатил подписку ✅'.
❗️ВАЖНО: Оплачивайте по этой ссылке только один раз
Если вы оплатили, но пишет, что оплата не найдена, просто попробуйте через 10-30 секунд ⏳
Ссылка на оплату: ${invoice.PaymentURL}
          `;

          const editMessage = await ctx.reply(messageText, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "Оплатить подписку 💰", url: invoice.PaymentURL }],
                [{ text: "Я оплатил подписку ✅", callback_data: 'i_paid' }]
              ]
            },
          });

          this.editMessageIds.set(user.userId, editMessage.message_id);
          this.paymentIds.set(user.userId, invoice.PaymentId);
          this.paymentStatuses.set(user.userId, true);
        }).catch((error) => logger.error(error));
      } catch (error) {
        logger.error(error);
      }
    });

    this.bot.action('i_paid', async (ctx) => {
      try {
        const userId = ctx.from?.id;
        if (userId) {
          const editMessageId = this.editMessageIds.get(userId);
          const paymentId = this.paymentIds.get(userId);
          const paymentStatus = this.paymentStatuses.get(userId);

          if (editMessageId && paymentId && paymentStatus) {
            this.paymentStatuses.set(userId, false);

            await ctx.telegram.editMessageText(ctx.chat?.id, editMessageId, '', 'Обработка оплаты...', { parse_mode: 'Markdown' });

            const invoice: any = await this.tinkoff.statusInvoice(paymentId);

            if (invoice.Status === 'CONFIRMED') {
              const user = await database.findUnique('user', { userId: userId });
              await database.update('user', { userId: userId }, { subscribe: user.subscribe + 30, lastPay: Date.now() });
              await ctx.reply('*Спасибо за подписку!*', { parse_mode: 'Markdown' });
              logger.info(`${userId} - https://t.me/${ctx.from?.username} bought a subscription`);
            } else {
              await ctx.reply('<b>Платёж не прошёл</b>', { parse_mode: 'HTML' });
              logger.info(`${userId} - https://t.me/${ctx.from?.username} payment failed`);
            }
          }
          this.editMessageIds.delete(userId);
          this.paymentIds.delete(userId);
          this.paymentStatuses.delete(userId);
        }
      } catch (error) {
        logger.error(error);
      }
    });
  }
}
