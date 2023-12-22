import { Context } from "telegraf";

export interface SessionData {
  user_id: number;
  registry: string;
  subscribe: number;
  mode: string;
  lastPay: number;
  rules: string;
}
export interface IBotContext extends Context {
  session: SessionData;
};