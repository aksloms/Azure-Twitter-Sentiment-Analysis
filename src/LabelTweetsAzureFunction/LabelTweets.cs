using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace LabelTweetsAzureFunction
{
    public static class LabelTweets
    {
        [FunctionName("LabelTweets")]
        public static void Run([QueueTrigger("tweetsque", Connection = "QueueStorageConnection")] string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
        }
    }
}
