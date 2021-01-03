using System;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using System.Linq;
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

            var peekedMassges = await queueClient.PeekMessagesAsync(10);
            Console.WriteLine(peekedMassges.Value.Length);

            // Encoding.Unicode.GetString()
            // Convert.FromBase64String()
            var message = ReadQueueMessage(peekedMassges.Value[0].Body);
            Console.WriteLine(message);
            // var tweet = JsonSerializer.Deserialize<Tweet>(message, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            // Console.WriteLine(tweet.Text);

            var tweets = peekedMassges.Value
                .Select(m => ReadQueueMessage(m.Body))
                .ToArray();

            Console.WriteLine(JsonSerializer.Serialize(tweets, new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
        }

        public static Tweet ReadQueueMessage(BinaryData messageData)
            => JsonSerializer.Deserialize<Tweet>(
                Encoding.UTF8.GetString(Convert.FromBase64String(messageData.ToString())),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
}
