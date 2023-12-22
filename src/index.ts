import { ConfigService } from "./config/config.service";
import { IConfigService } from './config/config.interface';
import { Telegraf, session } from "telegraf";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { Event } from "./events/event.class";
import { Start } from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import { PrismaClient } from '@prisma/client'
import { Mode } from "./commands/mode.command";
import { Vip } from "./commands/vip.command";
import { Profile } from "./commands/profile.command";
import { Photo } from "./events/photo.event";
import { Logger } from "./types/logger.class";

class Bot {
  bot: Telegraf<IBotContext>
  commands: Command[] = [];
  events: Event[] = [];
  prisma: any = new PrismaClient();
  logger: any = new Logger();
  constructor (private readonly config: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.config.get('TOKEN'))
    this.bot.use((new LocalSession({ database: 'database.json' })).middleware())
  }
  init () {
    this.commands = [
      new Start(this.bot, this.prisma),
      new Mode(this.bot, this.prisma),
      new Vip(this.bot, this.prisma),
      new Profile(this.bot, this.prisma)
    ]
    for (const command of this.commands) command.handle(this.logger);
    this.events = [
      new Photo(this.bot, this.prisma)
    ]
    for (const event of this.events) event.handle(this.logger);
    this.bot.launch()
    this.logger.info('Bot started')
  }
}
const bot = new Bot(new ConfigService());
bot.init();