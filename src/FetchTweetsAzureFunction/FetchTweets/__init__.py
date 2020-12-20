import datetime
import logging
import os
from datetime import datetime, timedelta, timezone
from searchtweets import gen_request_parameters, collect_results
from json import dumps

from typing import Union, Dict, List, Sequence

import azure.functions as func

def load_twitter_credentials() -> Dict[str, Union[str, None]]:
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
    return (t for t in tweets if t.get('lang', None) == 'pl')

def main(mytimer: func.TimerRequest, fetchedTweetsQue: func.Out[func.QueueMessage]) -> None:
    time = datetime.utcnow().replace(tzinfo=timezone.utc)
    
    hashtags = get_hashtags()
    credentials = load_twitter_credentials()
    start_time = time - timedelta(minutes=5)
    tweet_fields = ['id', 'text', 'created_at', 'lang']

    for hashtag in hashtags:
        query = hashtag

        logging.info(f'Fetching tweets with query: {query}')
        retquest_params = gen_request_parameters(
            query,
            start_time = start_time.strftime("%Y-%m-%d %H:%M"),
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

            logging.info(f'Unfiltered tweets count: {len(tweets)}')

            messages = []
            for t in filter_tweets(tweets):
                t['hashtag'] = hashtag
                messages.append(dumps(t))

            logging.info(f'Filtered tweets count: {len(messages)}')
            logging.info(messages)
            fetchedTweetsQue.set(messages)

    logging.info('Python timer trigger function ran at %s', time.isoformat())
