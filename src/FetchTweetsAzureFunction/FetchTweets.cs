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

            var requests = GetHashtags(config)
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

        public static IEnumerable<string> GetHashtags(IConfiguration config)
            => JsonSerializer.Deserialize<string[]>(config["Hashtags"]);

        public static async Task<IEnumerable<TweetV2>> GetTweetsForHashtagAsync(
            TwitterClient client,
            string hashtag)
        {
            // TODO: Support for storing las tweet id and using it in query
            var startTime = DateTime.UtcNow.AddMinutes(-5);
            var searchParams = new SearchTweetsV2Parameters(hashtag)
            {
                StartTime = DateTime.UtcNow.AddMinutes(-5),
            };

            var response = await GetAllTweets(client, searchParams);
            var newestId = response.NewestId;

            var tweets = response.Tweets.Where(t => t.Lang == "pl");
            return tweets;
        }

        /// <summary>Read mulit api paged response</summary>
        public static async Task<AllTweetsResponse> GetAllTweets(
            TwitterClient client,
            SearchTweetsV2Parameters parameters)
        {
            var tweets = new List<TweetV2>();
            var iterator = client.SearchV2.GetSearchTweetsV2Iterator(parameters);
            while (!iterator.Completed)
            {
                var result = await iterator.NextPageAsync();
                tweets.AddRange(result.Content.Tweets);
            }

            return new AllTweetsResponse
            {
                Tweets = tweets.ToArray(),
                NewestId = tweets.OrderBy(t => t.CreatedAt).Last().Id
            };
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
