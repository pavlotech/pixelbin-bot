import { Telegraf } from "telegraf";
import Pixelbin from "@pixelbin/admin";
import { PixelbinConfig, PixelbinClient, assets } from '@pixelbin/admin'
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { IConfigService } from "../config/config.interface";

export class Photo extends Command {
  constructor(bot: Telegraf<IBotContext>, private readonly config: IConfigService) {
    super(bot);
  }
  handle (logger: any, database: any): void {
    const pixelbin = async (fileUrl: string, fileId: string, mode: string) => {
      const pixelbinConfig = new PixelbinConfig({
        domain: "https://api.pixelbin.io",
        apiSecret: this.config.get('API_SECRET')
      });
      const pixelbin = new PixelbinClient(pixelbinConfig);

      await pixelbin.assets.urlUpload({
        url: fileUrl,
        path: "path",
        name: fileId,
        access: "public-read",
        tags: ["tag1", "tag2"],
        metadata: {},
        overwrite: false,
        filenameOverride: true,
      });
  
      let transformations: any[];
      switch (mode) {
        case 'rem_background':
          transformations = [{"name": "bg", "plugin": "erase"}];
          break;
        case 'rem_text':
          transformations = [{"name": "remove", "plugin": "wm", "values": [{"key": `rem_text`, "value": "true"}]}];
          break;
        case 'rem_logo':
          transformations = [{"name": "remove", "plugin": "wm", "values": [{"key": `rem_logo`, "value": "true"}]}];
          break;
        default:
          transformations = [{"name": "bg", "plugin": "erase"}];
      }
      const obj: any = {
        cloudName: this.config.get('CLOUD_NAME'),
        zone: this.config.get('ZONE'),
        version: "v2",
        transformations,
        filePath: `path/${fileId}.jpeg`,
        baseUrl: "https://cdn.pixelbin.io",
      };
      return Pixelbin.url.objToUrl(obj);
    }
    this.bot.on('photo', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from.id })
        if (user?.ban) return;
        if (user?.subscribe <= 0) {
          return ctx.reply(`У вас закончились запросы.\nКупить еще 30 - /vip`, { parse_mode: 'Markdown' })
        }
        const photo = ctx.message?.photo;
        const fileId = photo[photo.length - 1].file_id;
        const fileUrl = (await ctx.telegram.getFileLink(fileId)).href;

        //logger.log(photo)
        //logger.log(fileUrl)

        const pixelbinUrl = await pixelbin(fileUrl, fileId, user.mode)

        //logger.log(pixelbinUrl)

        ctx.replyWithChatAction('upload_document');
        ctx.replyWithDocument({ url: pixelbinUrl, filename: 'image.png' });

        await database.update('user', { userId: ctx.from.id }, { subscribe: user?.subscribe - 1 })
      } catch (error) {
        logger.error(error)
      }
    });
    this.bot.on('document', async (ctx) => {
      try {
        const user = await database.findUnique('user', { userId: ctx.from.id })
        if (user?.ban) return;
        if (user?.subscribe <= 0) {
          return ctx.reply(`У вас закончились запросы.\nКупить еще 30 - /vip`, { parse_mode: 'Markdown' })
        }
        const document = ctx.message?.document
        const fileId = document.thumbnail?.file_id;
        const fileUrl = (await ctx.telegram.getFileLink(fileId || '')).href;

        //logger.log(document)
        //logger.log(fileUrl)

        const pixelbinUrl = await pixelbin(fileUrl, fileId || '', user.mode)

        //logger.log(pixelbinUrl)

        ctx.replyWithChatAction('upload_document');
        ctx.replyWithDocument({ url: pixelbinUrl, filename: 'image.png' });
        
        await database.update('user', { userId: ctx.from.id }, { subscribe: user?.subscribe - 1 })
      } catch (error) {
        logger.error(error)
      }
    })
  }
}