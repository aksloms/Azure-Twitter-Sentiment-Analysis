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


def query_tweets(hashtag, select, start_date, end_date=None, max_tweets=100):
    hashtag = hashtag.replace("#", "")

    query_filter = f"PartitionKey eq '{hashtag}' and \
        CreatedAt ge datetime'{start_date}'"

    if end_date:
        query_filter += f" and CreatedAt lt datetime'{end_date}'"

    query = client.query_entities(
        filter=query_filter,
        select=select.values()
    )

    tweets = []
    for count, entity in enumerate(query, start=1):
        tweet = {}
        for new_name, name in select.items():
            tweet[new_name] = entity.get(name)
        tweets.append(tweet)

        if count == max_tweets:
            break

    return tweets


def get_average_sentiment(hashtag, start_date, end_date=None):
    select = {"sentiment": "CognitiveServicesSentimentScore"}
    tweets = query_tweets(hashtag, select, start_date, end_date, max_tweets=5)

    sentiment_sum = sum(t["sentiment"] for t in tweets)
    count = len(tweets)

    if count == 0:
        return {"count": 0}

    return {"sentiment": sentiment_sum / count,
            "count": count}


def get_binned_sentiment(hashtag, start_date, end_date, bins):
    select = {"date": "CreatedAt",
              "sentiment": "CognitiveServicesSentimentScore"}
    tweets = query_tweets(hashtag, select, start_date, end_date, max_tweets=10)

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

        return get_average_sentiment(hashtag, start_date, end_date)


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

        return get_average_sentiment(hashtag, start_date)
