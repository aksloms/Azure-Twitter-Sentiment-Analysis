from azure.data.tables import TableClient
from flask import request
from flask_restful import Resource
from dotenv import load_dotenv
from os import getenv


load_dotenv()
CONNECTION_STRING = getenv("CONNECTION_STRING")

client = TableClient.from_connection_string(
    conn_str=CONNECTION_STRING,
    table_name="LabeledTweets")


def get_sentiment(hashtag, start_date, end_date=None):
    query_filter = f"PartitionKey eq '{hashtag}' and \
        CreatedAt ge datetime'{start_date}'"

    if end_date:
        query_filter += f" and CreatedAt lt datetime'{end_date}'"

    query = client.query_entities(
        filter=query_filter,
        select=["CognitiveServicesSentimentScore"])

    sentiment_sum = 0
    for count, tweet in enumerate(query, start=1):
        sentiment_sum += tweet.get("CognitiveServicesSentimentScore")
        if count == 5:  # DEBUG
            break

    return {"average_sentiment": sentiment_sum / count,
            "count": count}


class AverageSentiment(Resource):
    def get(self):
        hashtag = request.args.get("hashtag")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        return get_sentiment(hashtag, start_date, end_date)
