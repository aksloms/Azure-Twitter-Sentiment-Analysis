namespace FetchTweetsAzureFunction.Shared
{
    using Tweetinvi.Models.V2;
    public class AllTweetsResponse
    {
        public TweetV2[] Tweets { get; set; }

        public string NewestId { get; set; }
    }
}