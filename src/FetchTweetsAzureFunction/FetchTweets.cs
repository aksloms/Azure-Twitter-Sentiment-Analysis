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
        public static ILogger _log;

        [FunctionName("FetchTweets")]
        public static async Task RunAsync(
            [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
            [Queue("tweetsque"), StorageAccount("AzureWebJobsStorage")] ICollector<string> msg,
            ILogger log)
        {
            _log = log;
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            var client = CreteTwitterClient(config);

            var storageAccount = CloudStorageAccount.Parse(config.GetConnectionString("mainStorage"));
            var tableClient = storageAccount.CreateCloudTableClient();
            var lastTweetTable = tableClient.GetTableReference(config["LastTweetTableName"]);

            var requests = GetHashtags(config)
                .Select(h => (h, GetTweetsForHashtagAsync(client, lastTweetTable, h)))
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
            string hashtag)
        {
            var hashtagTableKey = hashtag[1..];
            var lastTweet = (await lastTweetTable.ExecuteAsync(
                TableOperation.Retrieve<LastTweetIdEntity>(hashtagTableKey, hashtagTableKey)
            )).Result as LastTweetIdEntity;

            _log.LogInformation($"Newest id for hashtag before fetching data {hashtag}: {lastTweet?.NewestId}");

            var searchParams = new SearchTweetsV2Parameters($"{hashtag} lang:pl -is:retweet")
            {
                SinceId = lastTweet?.NewestId,
                // StartTime = DateTime.UtcNow.AddMinutes(-5), // TODO: Remove this line to fetch all new tweets. This line is here only for testing pourposes
            };

            const int pageLimit = 3; // Cap the amount of data loaded
            var response = await GetAllTweets(client, searchParams, pageLimit);

            if (response.NewestId != null)
            {
                lastTweet = new LastTweetIdEntity(hashtagTableKey) { NewestId = response.NewestId };
                await lastTweetTable.ExecuteAsync(TableOperation.InsertOrReplace(lastTweet));
            }

            return response.Tweets;
        }

        /// <summary>Read mulit api paged response</summary>
        public static async Task<AllTweetsResponse> GetAllTweets(
            TwitterClient client,
            SearchTweetsV2Parameters parameters,
            int pageLimit = int.MaxValue
            )
        {
            var tweets = new List<TweetV2>();
            var iterator = client.SearchV2.GetSearchTweetsV2Iterator(parameters);
            for (var i = 0; i < pageLimit && !iterator.Completed; i++)
            {
                var result = await iterator.NextPageAsync();
                tweets.AddRange(result.Content.Tweets);
            }

            var newestId = tweets.Count > 0
                ? tweets.Aggregate((agg, next) => next.CreatedAt > agg.CreatedAt ? next : agg).Id
                : null;
            return new AllTweetsResponse
            {
                Tweets = tweets.ToArray(),
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
