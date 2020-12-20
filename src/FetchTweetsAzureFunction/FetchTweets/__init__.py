import datetime
import logging
import os
from datetime import datetime, timedelta, timezone
from searchtweets import gen_request_parameters, collect_results
from typing import List

import azure.functions as func

def load_twitter_credentials() -> dict:
    return {
        'endpoint': os.getenv('TwitterAPIEndpoint'),
        'bearer_token': os.getenv('TwitterAPIBearerToken'),
        'extra_headers_dict': None
    }

def get_hashtags() -> List[str]:
    # TODO: Get hashtags from shared configuration like storage table or Application Settings
    return ['#kwarantanna', '#vege', '#IgaŚwiatek', '#hot16challenge', '#fitness', '#krolowezycia', '#kryzys', '#ikea', '#łódź', '#halloween', '#kawa', '#radom', '#karmieniepiersia', '#pomidorowa', '#COVID19', '#nvidia', '#poniedziałek', '#biedronka']

def filter_tweets():
    # TODO: Discard unusable tweets. Maybe filter by language
    pass

def main(mytimer: func.TimerRequest, fetchedTweetsQue: func.Out[func.QueueMessage]) -> None:
    time = datetime.utcnow().replace(tzinfo=timezone.utc)
    hashtags = get_hashtags()

    credentials = load_twitter_credentials()
    querry = hashtags[-1] # TODO: Fetch tweets for all hashtags
    start_time = time - timedelta(minutes=5)
    tweet_fields = ['id', 'text', 'created_at', 'lang']

    retquest_params = gen_request_parameters(
        querry,
        # start_time = start_time.strftime("%Y-%m-%d %H:%M"),
        results_per_call = 100,
        tweet_fields=','.join(tweet_fields),
        # since_id= # TODO: Use last fetch tweet id in request
    )

    response = collect_results(retquest_params,
        max_tweets=100,
        result_stream_args=credentials
    )
    tweets = response[:-1] if response else []
    response_metadata = response[-1] if response else []

    fetchedTweetsQue.set(["Test message 1", "Test message 2"])

    for r in response:
        logging.info(r)

    logging.info('Python timer trigger function ran at %s', time.isoformat())
