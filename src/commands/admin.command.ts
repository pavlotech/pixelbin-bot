import { Scenes, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";
import { IConfigService } from "../config/config.interface";
import { admin } from "../../settings";

export class Admin extends Command {
  constructor (bot: Telegraf<IBotContext>) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    this.bot.command('admin_panel', async (ctx) => {
      try {
        logger.info(`${ctx.from?.id} - https://t.me/${ctx.from?.username} use /admin_panel`)
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user) return;
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried to log into the admin panel`)

        ctx.reply(`*Вы вошли в панель администратора*`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: `Создать обьявление`, callback_data: 'create_announcement' }],
              [{ text: `Удалить обьявление`, callback_data: 'remove_announcement' }],
              [{ text: `Выдать права`, callback_data: 'add_admin' }],
              [{ text: `Удалить права`, callback_data: 'remove_admin' }],
              [{ text: `Забанить`, callback_data: 'ban_user' }],
              [{ text: `Разбанить`, callback_data: 'unban_user' }],
              [{ text: `Профиль пользователя`, callback_data: 'profile_user' }],
              [{ text: `Выдать запросы`, callback_data: 'give_requests' }],
              [{ text: `Забрать запросы`, callback_data: 'take_away_requests' }]
            ]
          },
          parse_mode: 'Markdown'
        })
      } catch (error) {
        logger.error(error);
      }
    })
    this.bot.action('give_requests', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('give_requests')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('take_away_requests', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('take_away_requests')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('create_announcement', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('create_announcement')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('remove_announcement', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('remove_announcement')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('add_admin', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        const password = generatePassword(30)
        ctx.reply(admin.text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: admin.button, url: `https://t.me/${ctx.botInfo.username}?start=${password}` }]
            ]
          },
          parse_mode: 'MarkdownV2'
        })
        await database.create('password', { password: password })        
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('remove_admin', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('remove_admin')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('ban_user', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('ban_user')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('unban_user', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('unban_user')
      } catch (error) {
        logger.error(error)
      }
    })
    this.bot.action('profile_user', async (ctx: IBotContext) => {
      try {
        const user = await database.findUnique('user', { userId: String(ctx.from?.id) })
        if (!user.admin) return logger.warn(`${ctx.from?.id} - https://t.me/${ctx.from?.username} tried using the admin panel`)

        ctx.scene.enter('profile_user')
      } catch (error) {
        logger.error(error)
      }
    })
    function generatePassword(length: number) {
      try {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password: string = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
      } catch (error) {
        logger.error(error)
      }
    }
  }
}