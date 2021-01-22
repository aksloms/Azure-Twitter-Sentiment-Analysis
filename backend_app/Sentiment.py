from azure.data.tables import TableClient
from flask import request
from flask_restful import Resource, reqparse
from datetime import datetime, timedelta
from config import CONNECTION_STRING, TABLE_NAME
from math import ceil
import pandas as pd


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


def parse_arguments(request, names):
    parser = reqparse.RequestParser(bundle_errors=True)

    for name in names:
        help_msg = name + " cannot be blank."
        parser.add_argument(name, required=True,
                            help=help_msg, location="args")

    return parser.parse_args()


class AverageSentiment(Resource):
    def get(self):
        args = parse_arguments(
            request, ["hashtag", "start_date", "end_date"])

        hashtag = args["hashtag"]
        start_date = args["start_date"]
        end_date = args["end_date"]

        return get_average_sentiment(hashtag, start_date, end_date)


class BinnedSentiment(Resource):
    def get(self):
        args = parse_arguments(
            request, ["hashtag", "start_date", "end_date", "bins"])

        hashtag = args["hashtag"]
        start_date = args["start_date"]
        end_date = args["end_date"]
        bins = int(args["bins"])

        if bins < 2:
            return {"message": {"bins": "Number of bins must be greater than 1."}}, 400

        return get_binned_sentiment(hashtag, start_date, end_date, bins)


class CurrentSentiment(Resource):
    def get(self):
        args = parse_arguments(request, ["hashtag"])

        hour_ago = datetime.utcnow() - timedelta(seconds=3600)
        start_date = hour_ago.replace(microsecond=0).isoformat()

        return get_average_sentiment(args["hashtag"], start_date)
