using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using FetchTweetsAzureFunction.Shared;
using Tweetinvi.Models;
using Tweetinvi;
using FetchTweetsAzureFunction.Extensions;
using Tweetinvi.Parameters.V2;
using System.Linq;
using System.Collections.Generic;

namespace FetchTweetsAzureFunction
{
    public static class FetchTweets
    {
        [FunctionName("FetchTweets")]
        public static async Task RunAsync([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log)
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

            var startTime = DateTime.UtcNow.AddMinutes(-5);
            var requests = GetHashtags()
                .Select(h => {
                    var searchParams = new SearchTweetsV2Parameters(h)
                    {
                        StartTime = DateTime.UtcNow.AddMinutes(-5),
                    };
                    return (h, client.SearchV2.SearchTweetsAsync(searchParams));
                })
                .ToList();

            foreach(var (hasthtag, request) in requests)
            {
                var result = await request;
                // TODO: Support for paged response
                var newstId = result.SearchMetadata.NewestId; //TODO: Store newest id
                var tweets = result.Tweets.Where(t => t.Lang == "pl");
                log.LogInformation($"Hashtag: {hasthtag}");
                log.LogInformation(string.Join("\n", tweets.Select(t => t.Text).Take(3)));
            }


            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }

        //TODO: Read hashtags form configuration of storage
        public static IEnumerable<string> GetHashtags()
            => new string[] { "#kwarantanna", "#vege", "#IgaŚwiatek", "#hot16challenge", "#fitness", "#krolowezycia", "#kryzys", "#ikea", "#łódź", "#halloween", "#kawa", "#radom", "#karmieniepiersia", "#pomidorowa", "#COVID19", "#nvidia", "#poniedziałek", "#biedronka" };
    }
}
