using System;
using System.Threading.Tasks;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using LabelTweetsAzureFunction.Models;
using LabelTweetsAzureFunction.Others;
using Microsoft.Extensions.Configuration;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;

namespace LabelTweetsAzureFunction
{
    public static class LabelTweets
    {
        [FunctionName("LabelTweets")]
        [return: Table("LabeledTweets", Connection = "DataStorageConnection")]
        public static async Task<Tweet> RunAsync([QueueTrigger("tweetsque", Connection = "QueueStorageConnection")] string queueMessage, ILogger log)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tweet = JsonSerializer.Deserialize<Tweet>(queueMessage, serializerOptions);

            tweet.CleanedText = CleanTweetText(tweet);
            tweet.CognitiveServicesSentimentScore = await GetSentimentScoreAsync(tweet.CleanedText, "pl", config);

            return tweet;
        }

        public static async Task<double?> GetSentimentScoreAsync(string text, string language, IConfigurationRoot config)
        {
            var credentials = new ApiKeyServiceClientCredentials(config["TextAnalyticsApiKey"]);
            var client = new TextAnalyticsClient(credentials)
            {
                Endpoint = config["TextAnalyticsEndpoint"]
            };

            var result = await client.SentimentAsync(text, language);
            return result.Score;
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
