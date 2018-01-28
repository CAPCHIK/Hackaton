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
using Telegram.Bot.Types.InlineKeyboardButtons;
using TelegramBot.Models;
using System.Data.SqlClient;

namespace TelegramBot.Controllers
{
    [Produces("application/json")]
    [Route("api/TelegramBot")]
    public class TelegramBotController : Controller
    {
        private readonly TelegramBotClient telegramBotClient;
        private readonly ApplicationDbContext dbContext;

        public TelegramBotController(TelegramBotClient telegramBotClient, ApplicationDbContext dbContext)
        {
            this.telegramBotClient = telegramBotClient;
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Route("hook")]
        public async Task<IActionResult> Hook([FromBody]Update update, Player model)
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
                var inlineKeyboard = new InlineKeyboardMarkup(new[] { new InlineKeyboardUrlButton("Перекрестись и прыгай в виртуальную реальность(VR)", "yandex.ru") });
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Ты выбрал Carry. Приятной игры, чувак!;)", replyMarkup: inlineKeyboard);

            }

            if (message.Text.StartsWith("Support"))
            {

                var inlineKeyboard = new InlineKeyboardMarkup(new[] { new InlineKeyboardUrlButton("Перекрестись и прыгай в дополненную реальность(AR)", "https://vk.com/away.php?to=https%3A%2F%2Fwebrtcfunhack.azurewebsites.net%2Fself%2Fexamples%2Findex.html&cc_key=") });
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Ты выбрал Support. Приятной игры, чувак!;)", replyMarkup: inlineKeyboard);
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Но перед этим тебе нужно распечатать эту шнягу, чтобы все хорошо работало. Для этого перейди по следующей ссылке:\n https://vk.com/away.php?to=https%3A%2F%2Fwebrtcfunhack.azurewebsites.net%2Fself%2Fexamples%2Fassets%2Fpictures%2Fextensions%2Fhiro.jpg&cc_key=");
            }

            if (message.Text.StartsWith("/help"))
            {
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "1. /game - начать игру.\n2. /help - показать список команд.\n3. /topscore - вывести таблицу рекордов.\n4. /start - начать общение со мной");
            }

            if (message.Text.StartsWith("/start"))
            {
                model.TelegramId = message.From.Id;
                var player = dbContext.Players.FirstOrDefault(P => P.TelegramId == message.From.Id);
                if (player == null)
                {
                    model.Support = new Support();
                    model.Carry = new Carry();
                    await dbContext.Players.AddAsync(model);
                    await dbContext.SaveChangesAsync();
                    await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Привет чуваааак! Ты зашел к MemDefenseBot. Чтобы начать играть в самую А%@$&*Ю игру начеркай мне /game и наслаждайся игрой!))");
                }
                if (player != null)
                {
                    await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Какие люди, х@и на блюде, прыгай ко мне в игру!))/game");
                }
            }

            if (message.Text.StartsWith("/topscore"))
            {
                int count = 0;
                string line = "";
                dbContext.Players.OrderBy(P => P.Score);
                var topScores = dbContext.Players.Take(5).Select(P => P.Score);
                foreach (var score in topScores)
                {
                    count++;
                    line += $"{count}. {score.ToString()}\n";
                }
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Таблица рекордов:\n" + line);
            }

            if (message.Text.StartsWith("/score"))
            {
                var id = message.From.Id;
                dbContext.Players.OrderBy(P => P.Score);
                var score = dbContext.Players;

                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Твой результат: " + score.ToString());
            }

            if (!message.Text.StartsWith("/score") &&
                !message.Text.StartsWith("/topscore") &&
                !message.Text.StartsWith("/start") &&
                !message.Text.StartsWith("/help") &&
                !message.Text.StartsWith("Support") &&
                !message.Text.StartsWith("Carry") &&
                !message.Text.StartsWith("/game"))
            {
                await telegramBotClient.SendTextMessageAsync(message.Chat.Id, "Сорри, я фигово учился в бот-школе, поэтому я не все понимаю, что ты мне пишешь. Глянь, что ты мне можешь написать./help");
            }

            return Ok();
        }
    }
}