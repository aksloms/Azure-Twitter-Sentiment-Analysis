using FetchTweetsAzureFunction.Shared;
using Tweetinvi.Models;

namespace FetchTweetsAzureFunction.Extensions
{
    public static class TweetinviExtensions
    {
        public static ConsumerOnlyCredentials LoadCredentials(
            this ConsumerOnlyCredentials credentials,
            TwitterApiConfig config
        ) => new ConsumerOnlyCredentials(config.ConsumerKey, config.ConsumerSecret)
        {
            BearerToken = config.BearerToken
        };
    }
}