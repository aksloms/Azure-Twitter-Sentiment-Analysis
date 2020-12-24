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

            var searchParams = new SearchTweetsV2Parameters("#christmas")
            {
                StartTime = DateTime.UtcNow.AddMinutes(-5),
                PageSize = 10
            };

            var response = await client.SearchV2.SearchTweetsAsync(searchParams);
            foreach (var t in response.Tweets.Select(t => t.Text))
            {
                log.LogInformation(t);
            }

            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }
    }
}
