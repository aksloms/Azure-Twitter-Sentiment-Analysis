namespace FetchTweetsAzureFunction
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.Json;
    using System.Threading.Tasks;
    using FetchTweetsAzureFunction.Extensions;
    using FetchTweetsAzureFunction.Shared;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Host;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Tweetinvi;
    using Tweetinvi.Models;
    using Tweetinvi.Models.V2;
    using Tweetinvi.Parameters.V2;

    public static class FetchTweets
    {
        [FunctionName("FetchTweets")]
        public static async Task RunAsync(
            [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
            [Queue("tweetsque"), StorageAccount("AzureWebJobsStorage")] ICollector<string> msg,
            ILogger log)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            var client = CreteTwitterClient(config);

            var requests = GetHashtags()
                .Select(h => (h, GetTweetsForHashtagAsync(client, h)))
                .ToList();

            foreach (var (hashtag, tweetsRequest) in requests)
            {
                foreach (var tweet in await tweetsRequest)
                {
                    msg.Add(CreateMessage(hashtag, tweet));
                }
            }

            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }

        // TODO: Read hashtags form configuration of storage
        public static IEnumerable<string> GetHashtags()
            => new string[] { "#kwarantanna", "#vege", "#IgaŚwiatek", "#hot16challenge", "#fitness", "#krolowezycia", "#kryzys", "#ikea", "#łódź", "#halloween", "#kawa", "#radom", "#karmieniepiersia", "#pomidorowa", "#COVID19", "#nvidia", "#poniedziałek", "#biedronka" };

        public static async Task<IEnumerable<TweetV2>> GetTweetsForHashtagAsync(
            TwitterClient client,
            string hashtag)
        {
            // TODO: Support for paged response
            // TODO: Support for storing las tweet id and using it in query
            var startTime = DateTime.UtcNow.AddMinutes(-5);
            var searchParams = new SearchTweetsV2Parameters(hashtag)
            {
                StartTime = DateTime.UtcNow.AddMinutes(-5),
            };

            var respnose = await client.SearchV2.SearchTweetsAsync(searchParams);
            // TODO: Store newest id
            var newestId = respnose.SearchMetadata.NewestId;

            var tweets = respnose.Tweets.Where(t => t.Lang == "pl");
            return tweets;
        }

        public static string CreateMessage(string hashtag, TweetV2 tweet) => JsonSerializer.Serialize(new
        {
            SearchHashtag = hashtag,
            tweet.Id,
            tweet.AuthorId,
            tweet.CreatedAt,
            tweet.Entities.Hashtags,
            tweet.Entities.Urls,
            tweet.Text,
        }, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        public static TwitterClient CreteTwitterClient(IConfiguration config)
        {
            var twitterApiConfig = new TwitterApiConfig
            {
                ConsumerKey = config["TweeterAPIKey"],
                ConsumerSecret = config["TweeterAPISecret"],
                BearerToken = config["TwitterAPIBearerToken"]
            };

            var appCredentials = new ConsumerOnlyCredentials().LoadCredentials(twitterApiConfig);
            return new TwitterClient(appCredentials);
        }
    }
}
