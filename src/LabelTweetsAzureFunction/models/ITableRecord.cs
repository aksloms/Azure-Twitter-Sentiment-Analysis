namespace LabelTweetsAzureFunction.Models
{
    public interface ITableRecord
    {
        public string PartitionKey { get; }
        public string RowKey { get; }
    }
}