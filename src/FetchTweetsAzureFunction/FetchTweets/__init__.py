import datetime
import logging
import os
from datetime import datetime, timedelta, timezone
from searchtweets import gen_request_parameters, collect_results
from json import dumps

from typing import Union, Dict, List, Sequence

import azure.functions as func

def load_twitter_credentials() -> Dict[str, str]:
    return {
        'endpoint': os.getenv('TwitterAPIEndpoint'),
        'bearer_token': os.getenv('TwitterAPIBearerToken'),
        'extra_headers_dict': None
    }

def get_hashtags() -> List[str]:
    # TODO: Get hashtags from shared configuration like storage table or Application Settings
    return ['#kwarantanna', '#vege', '#IgaŚwiatek', '#hot16challenge', '#fitness', '#krolowezycia', '#kryzys', '#ikea', '#łódź', '#halloween', '#kawa', '#radom', '#karmieniepiersia', '#pomidorowa', '#COVID19', '#nvidia', '#poniedziałek', '#biedronka']

def filter_tweets(tweets: Sequence[Dict[str, str]]) -> Sequence[Dict[str, str]]:
    '''Discard unusable tweets'''
    return (t for t in tweets if t['lang'] == 'pl')

def main(mytimer: func.TimerRequest, fetchedTweetsQue: func.Out[func.QueueMessage]) -> None:
    time = datetime.utcnow().replace(tzinfo=timezone.utc)
    hashtags = get_hashtags()

    credentials = load_twitter_credentials()
    querry = hashtags[-1] # TODO: Fetch tweets for all hashtags
    start_time = time - timedelta(minutes=5)
    tweet_fields = ['id', 'text', 'created_at', 'lang']

    hashtag = hashtags[-1] # TODO: Fetch tweets for all hashtags
    retquest_params = gen_request_parameters(
        hashtag,
        # start_time = start_time.strftime("%Y-%m-%d %H:%M"),
        results_per_call = 100,
        tweet_fields=','.join(tweet_fields),
        # since_id= # TODO: Use last fetch tweet id in request
    )

    response = collect_results(retquest_params,
        max_tweets=100,
        result_stream_args=credentials
    )

    if (response):
        tweets = response[:-1]
        response_metadata = response[-1]
        # TODO: Store 'newest_id'
        # TODO: Support pagination

        messages = []
        for t in filter_tweets(tweets):
            t['hashtag'] = hashtag
            messages.append(dumps(t))

        logging.info(messages)
        fetchedTweetsQue.set(messages)

    logging.info('Python timer trigger function ran at %s', time.isoformat())
