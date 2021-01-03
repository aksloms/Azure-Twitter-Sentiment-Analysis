using System;
using System.Collections.Generic;

namespace DownloadTweetsFromQueue
{
    public class Hashtag
    {
        public int Start { get; set; }
        public int End { get; set; }
        public string Tag { get; set; }
    }

    public class TweetUrl
    {
        public string DisplayUrl { get; set; }
        public int End { get; set; }
        public string ExpandedUrl { get; set; }
        public int Start { get; set; }
        public string Url { get; set; }
        public string UnwoundUrl { get; set; }
    }

    public class Tweet
    {
        public string SearchHashtag { get; set; }
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<Hashtag> Hashtags { get; set; }
        public IList<TweetUrl> Urls { get; set; }
        public string Text { get; set; }
    }

}