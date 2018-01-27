using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TelegramBot.Models
{
    public class Player
    {
        public Guid Id { get; set; }
        public long TelegramId { get; set; }
        public int Score { get; set; }
        public Guid CarryId { get; set; }
        public Carry Carry { get; set; }
        public Guid SupportId { get; set; }
        public Support Support { get; set; }

    }
}
