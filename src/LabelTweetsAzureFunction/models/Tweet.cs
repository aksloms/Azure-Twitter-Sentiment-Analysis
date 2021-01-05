using System;
using System.Collections.Generic;

namespace LabelTweetsAzureFunction.Models
{
    public class Tweet : ITableRecord
    {
        public string RowKey => Id;
        public string PartitionKey => SearchHashtag[1..];
        public string SearchHashtag { get; set; }
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<HashtagMarker> Hashtags { get; set; }
        public IList<UrlMarker> Urls { get; set; }
        public string Text { get; set; }

        #region labeling data
        public string CleanedText { get; set; }
        public double? CognitiveServicesSentimentScore { get; set; }
        #endregion
    }

    public class HashtagMarker : ITextMarker
    {
        public int Start { get; set; }
        public int End { get; set; }
        public string Tag { get; set; }
    }

    public class UrlMarker : ITextMarker
    {
        public string DisplayUrl { get; set; }
        public int End { get; set; }
        public string ExpandedUrl { get; set; }
        public int Start { get; set; }
        public string Url { get; set; }
        public string UnwoundUrl { get; set; }
    }
}