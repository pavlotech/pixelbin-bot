import { Telegraf } from "telegraf";
import { Event } from "./event.class";
import { IBotContext } from "../context/context.interface";
import Pixelbin from "@pixelbin/core";

export class Photo extends Event {
  constructor (bot: Telegraf<IBotContext>, prisma: any) {
    super(bot, prisma);
  }
  handle (logger: any): void {
    this.bot.on('photo', (ctx) => {
      console.log(ctx.message.photo)
    })
  }
}