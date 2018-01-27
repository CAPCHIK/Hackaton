using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Newtonsoft.Json;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramBot.Controllers
{
    [Produces("application/json")]
    [Route("api/TelegramBot")]
    public class TelegramBotController : Controller
    {
        private readonly TelegramBotClient telegramBotClient;

        public TelegramBotController(TelegramBotClient telegramBotClient)
        {
            this.telegramBotClient = telegramBotClient;
        }

        [HttpPost]
        [Route("hook")]
        public async Task<IActionResult> Hook([FromBody]Update update)
        {
            if (update == null)
            {
                return BadRequest();
            }
            var message = update.Message;

            if (message.Text.StartsWith("/game"))
            {
                var keyboard = new ReplyKeyboardMarkup(
                    new[]
                    {
                        new KeyboardButton("Carry"),
                        new KeyboardButton("Support")
                    },
                    true);

                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Выбери, плес, перса, за которого хочешь играть))", replyMarkup: keyboard);
            }

            if (message.Text.StartsWith("Carry"))
            {
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Ты выбрал Carry. Приятной игры, чувак!;)", replyMarkup: new ReplyKeyboardRemove());
            }

            if (message.Text.StartsWith("Support"))
            {
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Ты выбрал Support. Приятной игры, чувак!;)", replyMarkup: new ReplyKeyboardRemove());
            }

            if (message.Text.StartsWith("/help"))
            {
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "1. /game - начать игру.\n2. /help - показать список команд");
            }
            return Ok();

        }

        //private async Task SendMessage(long clientId, string messageText, IReplyMarkup markup = null)
        //{
        //    if (messageId == null)
        //    {
        //        var m = await telegramBotClient.SendTextMessageAsync(clientId, messageText, replyMarkup: markup);
        //        messageId = m.MessageId;
        //    }
        //    else
        //    {
        //        await telegramBotClient.EditMessageTextAsync(clientId, messageId.Value, messageText, replyMarkup: markup);

        //    }
        //}
    }
}