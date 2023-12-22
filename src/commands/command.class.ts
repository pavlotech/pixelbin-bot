import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export abstract class Command {
  constructor (public bot: Telegraf<IBotContext>, public prisma: any) { };
  
  abstract handle (logger: any): void;
}