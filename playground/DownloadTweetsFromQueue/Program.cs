using System;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Azure.Storage.Queues; // Namespace for Queue storage types
using Azure.Storage.Queues.Models; // Namespace for PeekedMessage

namespace DownloadTweetsFromQueue
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddYamlFile("appsettings.yml")
                .Build();

            var queueClient = new QueueClient(config.GetConnectionString("MainStorage"), config["QueName"]);
            Console.WriteLine(await queueClient.ExistsAsync());
        }
    }
}
