import { Abortable } from "events";
import internal from "stream";
import { Context, Scenes } from "telegraf";

export interface SessionData {
  editMessageId: number;
  paymentId: string;
  paymentStatus: boolean;
};
export interface SceneData {

};

export interface ISceneContext extends Scenes.SceneContext {
  session: SceneData;
};

export interface IBotContext extends Context {
  session: SessionData;
  scene: any;
};