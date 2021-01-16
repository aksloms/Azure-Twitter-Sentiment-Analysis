using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Queues; // Namespace for Queue storage types
using Azure.Storage.Queues.Models; // Namespace for PeekedMessage
using System.Collections.Generic;

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

            var responses = new List<Azure.Response<QueueMessage[]>>();
            for (var i = 0; i < 22; i++)
            {
                responses.Add(await queueClient.ReceiveMessagesAsync(32));
            }

            var messages = responses.SelectMany(r => r.Value);
            var tweets = messages
                .Select(m => ReadQueueMessage(m.Body))
                .ToArray();

            var serialized = JsonSerializer.Serialize(tweets, new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await File.WriteAllTextAsync("result.json", serialized);


            // var peekedMassges = await queueClient.PeekMessagesAsync(10);
            // Console.WriteLine(peekedMassges.Value.Length);


            // var message = ReadQueueMessage(peekedMassges.Value[0].Body);

            // var tweets = peekedMassges.Value
            //     .Select(m => ReadQueueMessage(m.Body))
            //     .ToArray();

            // var serialized = JsonSerializer.Serialize(tweets, new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            // await File.WriteAllTextAsync("result.json", serialized);
        }

        public static Tweet ReadQueueMessage(BinaryData messageData)
            => JsonSerializer.Deserialize<Tweet>(
                Encoding.UTF8.GetString(Convert.FromBase64String(messageData.ToString())),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
}
