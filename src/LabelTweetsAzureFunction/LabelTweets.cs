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
        [return: Table("LabeledTweets", Connection = "DataStorageConnection")]
        public static Tweet Run([QueueTrigger("tweetsque", Connection = "QueueStorageConnection")] string queueMessage, ILogger log)
        {
            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tweet = JsonSerializer.Deserialize<Tweet>(queueMessage, serializerOptions);

            tweet.CleanedText = CleanTweetText(tweet);

            log.LogInformation($"C# Queue trigger function processed: {queueMessage}");
            return tweet;
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
