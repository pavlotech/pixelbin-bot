import { ConfigService } from "./config/config.service";
import { IConfigService } from './config/config.interface';
import { Telegraf, session, Scenes } from "telegraf";
import { IBotContext, ISceneContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { Start } from "./commands/start.command";
import { PrismaClient } from '@prisma/client'
import { Mode } from "./commands/mode.command";
import { Vip } from "./commands/vip.command";
import { Profile } from "./commands/profile.command";
import { Photo } from "./commands/photo.command";
import { Logger } from "./types/logger.class";
import { Database } from "./types/database.class";
import { Admin } from "./commands/admin.command";
import { Scene } from "./types/scene.class";
import { Post } from "./commands/post.command";
import { VipScene } from "./commands/vip.scene";
import LocalSession from "telegraf-session-local";

export class Bot {
  bot!: Telegraf<IBotContext>;
  prisma: any = new PrismaClient();
  logger: any = new Logger();
  database: any = new Database(this.prisma, this.logger);
  commands: Command[] = [];
  
  constructor (private readonly config: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.config.get('TOKEN'), { handlerTimeout: 60 * 60 * 1000 })
    const scene = new Scene(this.database, this.logger);
    const vip = new VipScene(this.database, this.logger, this.config)
    const stage = new Scenes.Stage<ISceneContext>([
      scene.create_announcement(),
      scene.remove_announcement(),
      scene.get_text(),
      scene.post(),
      scene.get_button(),
      scene.remove_admin(),
      scene.ban_user(),
      scene.unban_user(),
      scene.profile_user(),
      scene.give_requests(),
      scene.take_away_requests(),
      scene.give_requests_cb(),
      scene.take_away_requests_cb(),
      vip.get_email()
    ], { ttl: 10 * 60 * 1000 });
    this.bot.use(session())
    //this.bot.use(new LocalSession({ database: 'session.json'}))
    this.bot.use(stage.middleware());  
  }
  init () {
    this.commands = [
      new Start(this.bot, this.config),
      new Mode(this.bot),
      new Vip(this.bot, this.config),
      new Profile(this.bot),
      new Photo(this.bot, this.config),
      new Post(this.bot),
      new Admin(this.bot)
    ]
    for (const command of this.commands) command.handle(this.logger, this.database);

    this.bot.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Запустить бота',
      },
      {
        command: 'vip',
        description: 'Купить подписку',
      },
      {
        command: 'my_profile',
        description: 'Мой профиль'
      },
      {
        command: 'mode_rem_background',
        description: 'Удаление фона'
      },
      {
        command: 'mode_rem_text',
        description: 'Удаление вод. знаков (текст)'
      },
      {
        command: 'mode_rem_logo',
        description: 'Удаление вод. знаков (лого)'
      }
    ])
    this.bot.launch()
    this.logger.info('bot started')
  }
}
const bot = new Bot(new ConfigService());
bot.init()