using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using FetchTweetsAzureFunction.Shared;
using Tweetinvi;
using Tweetinvi.Models;
using Tweetinvi.Models.V2;
using FetchTweetsAzureFunction.Extensions;
using Tweetinvi.Parameters.V2;
using System.Linq;
using System.Collections.Generic;
using System.Text.Json;

namespace FetchTweetsAzureFunction
{
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

            var twitterApiConfig = new TwitterApiConfig
            {
                ConsumerKey = config["TweeterAPIKey"],
                ConsumerSecret = config["TweeterAPISecret"],
                BearerToken = config["TwitterAPIBearerToken"]
            };

            var appCredentials = new ConsumerOnlyCredentials().LoadCredentials(twitterApiConfig);
            var client = new TwitterClient(appCredentials);

            var requests = GetHashtags()
                .Select(h => (h, GetTweetsForHashtagAsync(client, h)))
                .ToList();

            foreach (var (hasthtag, tweetsRequest) in requests)
            {
                var tweets = await tweetsRequest;
                log.LogInformation($"Hashtag: {hasthtag}");
                log.LogInformation(string.Join("\n", tweets.Select(t => t.Text).Take(3)));

                foreach (var tweet in tweets)
                {
                    var id = tweet.Id;
                    var text = tweet.Text;
                    var message = JsonSerializer.Serialize(new {hasthtag, text, id});
                    msg.Add(message);
                }
            }

            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }

        //TODO: Read hashtags form configuration of storage
        public static IEnumerable<string> GetHashtags()
            => new string[] { "#kwarantanna", "#vege", "#IgaŚwiatek", "#hot16challenge", "#fitness", "#krolowezycia", "#kryzys", "#ikea", "#łódź", "#halloween", "#kawa", "#radom", "#karmieniepiersia", "#pomidorowa", "#COVID19", "#nvidia", "#poniedziałek", "#biedronka" };

        public static async Task<IEnumerable<TweetV2>> GetTweetsForHashtagAsync(
            TwitterClient client,
            string hashtag
        )
        {
            // TODO: Support for paged response
            //TODO: Support for storing las tweet id and using it in query
            var startTime = DateTime.UtcNow.AddMinutes(-5);
            var searchParams = new SearchTweetsV2Parameters(hashtag)
            {
                StartTime = DateTime.UtcNow.AddMinutes(-5),
            };

            var respnose = await client.SearchV2.SearchTweetsAsync(searchParams);
            //TODO: Store newest id
            var newestId = respnose.SearchMetadata.NewestId;

            var tweets = respnose.Tweets.Where(t => t.Lang == "pl");
            return tweets;
        }
    }
}
