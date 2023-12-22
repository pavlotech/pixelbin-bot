export class Response {
  public start (): string {
    return `
Вы подписались на KolerskyWhisperBot!
Он подключен к нейросети Whisper для перевода аудио в текст от производителя ChatGPT.
Подпишитесь на канал, чтобы всегда иметь актуальную информацию: @kolerskych.
Там же обсуждение и вопросы.
- перевод любых аудио в текст;
- расшифровка голосовых (в т.ч. из whatsapp);
- запросы с ChatGPT голосом;
[Инструкция](https://kolersky.com/whisper)
Для работы с нейросетью отравьте свой запрос боту
`;
  }
  public vip (): string {
    return ``
  }
}