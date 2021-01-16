namespace LabelTweetsAzureFunction.Models
{
    public interface ITextMarker
    {
        public int Start { get; set; }
        public int End { get; set; }
    }
}