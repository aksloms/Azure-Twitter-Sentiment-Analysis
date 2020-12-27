namespace FetchTweetsAzureFunction
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.Json;
    using System.Threading.Tasks;
    using FetchTweetsAzureFunction.Extensions;
    using FetchTweetsAzureFunction.Models;
    using FetchTweetsAzureFunction.Shared;
    using Microsoft.Azure.Cosmos.Table;
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

            var storageAccount = CloudStorageAccount.Parse(config.GetConnectionString("mainStorage"));
            var tableClient = storageAccount.CreateCloudTableClient();
            var lastTweetTable = tableClient.GetTableReference(config["LastTweetTableName"]);

            var requests = GetHashtags(config)
                .Select(h => (h, GetTweetsForHashtagAsync(client, lastTweetTable, log, h)))
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
            CloudTable lastTweetTable,
            ILogger log,
            string hashtag)
        {
            var lastTweet = (await lastTweetTable.ExecuteAsync(
                TableOperation.Retrieve<LastTweetIdEntity>(hashtag, hashtag)
            )).Result as LastTweetIdEntity;

            log.LogInformation($"{hashtag}: {lastTweet?.NewestId}");

            var startTime = DateTime.UtcNow.AddMinutes(-5);
            var searchParams = new SearchTweetsV2Parameters(hashtag)
            {
                SinceId = lastTweet?.NewestId,
                StartTime = DateTime.UtcNow.AddMinutes(-5), // TODO: Remove this line to fetch all new tweets. This line is here only for testing pourposes
            };

            var response = await GetAllTweets(client, searchParams);

            lastTweet = new LastTweetIdEntity(hashtag) { NewestId = response.NewestId };
            await lastTweetTable.ExecuteAsync(TableOperation.InsertOrReplace(lastTweet));

            return response.Tweets.Where(t => t.Lang == "pl");
        }

        /// <summary>Read mulit api paged response</summary>
        public static async Task<AllTweetsResponse> GetAllTweets(
            TwitterClient client,
            SearchTweetsV2Parameters parameters)
        {
            var limit = 100;

            var tweets = new List<TweetV2>();
            var iterator = client.SearchV2.GetSearchTweetsV2Iterator(parameters);
            for (var i = 0; i < limit && !iterator.Completed; i++)
            {
                var result = await iterator.NextPageAsync();
                tweets.AddRange(result.Content.Tweets);
            }
            // while (!iterator.Completed)
            // {
            //     var result = await iterator.NextPageAsync();
            //     tweets.AddRange(result.Content.Tweets);
            // }

            var newestId = tweets.Aggregate(
                (agg, next) => next.CreatedAt > agg.CreatedAt ? next : agg)
                .Id;
            return new AllTweetsResponse
            {
                Tweets = tweets.ToArray(),
                // NewestId = tweets.OrderBy(t => t.CreatedAt).Last().Id
                NewestId = newestId,
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
