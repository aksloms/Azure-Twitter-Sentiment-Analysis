using System;
using Microsoft.Extensions.Configuration;

namespace DownloadTweetsFromQueue
{
    class Program
    {
        static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddYamlFile("appsettings.yml")
                .Build();

            Console.WriteLine(config.GetConnectionString("MainStorage"));
        }
    }
}
