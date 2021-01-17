from azure.data.tables import TableClient
from flask import request
from flask_restful import Resource
from datetime import datetime, timedelta
from config import CONNECTION_STRING, TABLE_NAME
import pandas as pd
from math import ceil


client = TableClient.from_connection_string(
    conn_str=CONNECTION_STRING,
    table_name=TABLE_NAME)


def create_query(hashtag, select, start_date, end_date=None):
    hashtag = hashtag.replace("#", "")

    query_filter = f"PartitionKey eq '{hashtag}' and \
        CreatedAt ge datetime'{start_date}'"

    if end_date:
        query_filter += f" and CreatedAt lt datetime'{end_date}'"

    return client.query_entities(
        filter=query_filter,
        select=select
    )


def get_sentiment(hashtag, start_date, end_date=None):
    query = create_query(
        hashtag, ["CognitiveServicesSentimentScore"], start_date, end_date)

    sentiment_sum = 0
    for count, tweet in enumerate(query, start=1):
        sentiment_sum += tweet.get("CognitiveServicesSentimentScore")
        if count == 5:  # DEBUG
            break

    if sentiment_sum == 0:
        return {"count": 0}

    return {"sentiment": sentiment_sum / count,
            "count": count}


def get_binned_sentiment(hashtag, start_date, end_date, bins):
    select = ["CreatedAt", "CognitiveServicesSentimentScore"]
    query = create_query(hashtag, select, start_date, end_date)

    tweets = []
    for count, tweet in enumerate(query, start=1):
        tweets.append({
            "date": tweet.get("CreatedAt"),
            "sentiment": tweet.get("CognitiveServicesSentimentScore")
        })
        if count == 10:  # DEBUG
            break

    start = tweets[0].get("date")
    end = tweets[-1].get("date")
    seconds = (end - start).total_seconds()
    freq = ceil(seconds / (bins-1))

    tweets = pd.DataFrame(tweets)
    tweets["date"] = pd.to_datetime(tweets["date"], utc=True)
    grouped = tweets.groupby(pd.Grouper(
        key="date", freq=f"{freq}S", label="right")).mean().dropna()

    dates = []
    for date in list(grouped.index.values):
        dt = datetime.utcfromtimestamp(date.astype("O")/1e9)
        dates.append(dt.isoformat())

    sentiments = list(grouped["sentiment"])
    return {"dates": dates, "sentiments": sentiments}


class AverageSentiment(Resource):
    def get(self):
        hashtag = request.args.get("hashtag")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        return get_sentiment(hashtag, start_date, end_date)


class BinnedSentiment(Resource):
    def get(self):
        hashtag = request.args.get("hashtag")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        bins = int(request.args.get("bins"))

        return get_binned_sentiment(hashtag, start_date, end_date, bins)


class CurrentSentiment(Resource):
    def get(self):
        hashtag = request.args.get("hashtag")

        hour_ago = datetime.utcnow() - timedelta(seconds=3600)
        start_date = hour_ago.replace(microsecond=0).isoformat()

        return get_sentiment(hashtag, start_date)
