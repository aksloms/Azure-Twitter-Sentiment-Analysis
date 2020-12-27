using Microsoft.Azure.Cosmos.Table;

namespace FetchTweetsAzureFunction.Models
{
    public class LastTweetIdEntity : TableEntity
    {
        public LastTweetIdEntity()
        {
        }

        public LastTweetIdEntity(string hashtag)
        {
            PartitionKey = hashtag;
            RowKey = hashtag;
        }

        public string NewestId { get; set; }
    }
}