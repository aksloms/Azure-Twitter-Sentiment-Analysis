using System;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using LabelTweetsAzureFunction.Models;

namespace LabelTweetsAzureFunction
{
    public static class LabelTweets
    {
        [FunctionName("LabelTweets")]
        public static void Run([QueueTrigger("tweetsque", Connection = "QueueStorageConnection")] string queueMessage, ILogger log)
        {
            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tweet = JsonSerializer.Deserialize<Tweet>(queueMessage);

            tweet.CleanedText = CleanTweetText(tweet);

            log.LogInformation($"C# Queue trigger function processed: {queueMessage}");
        }

        public static string CleanTweetText(Tweet tweet)
        {
            var markersToRemove = tweet.Hashtags.AsEnumerable<ITextMarker>()
                .Concat(tweet.Urls)
                .OrderBy(m => m.Start);

            var builder = new StringBuilder(tweet.Text.Length);
            var currentPostion = 0;
            foreach (var marker in markersToRemove)
            {
                builder.Append(tweet.Text[currentPostion..marker.Start]);
                currentPostion = marker.End;
            }

            return builder.ToString();
        }
    }
}
