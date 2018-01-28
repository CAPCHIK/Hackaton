using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Telegram.Bot;
using Telegram.Bot.Args;
using Microsoft.EntityFrameworkCore;

namespace TelegramBot
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            TelegramBotClient bot = new TelegramBotClient("492217587:AAGRJcM5NzufgqL8P44Vd60KcmXfBxUNauk");
            services.AddSingleton(bot);

            services.AddDbContext<ApplicationDbContext>(
                builder => builder.UseSqlServer("Server=tcp:payeddb.database.windows.net,1433;Initial Catalog=gunhackfuckhim;Persist Security Info=False;User ID=capchik;Password=AwesomePass1;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
        }
    }
}
