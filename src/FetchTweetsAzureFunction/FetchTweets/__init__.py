import datetime
import logging
from collections import namedtuple
import os

import azure.functions as func

def load_twitter_credentials() -> dict:
    return {
        'endpoint': os.getenv('TwitterAPIEndpoint'),
        'bearer_token': os.getenv('TwitterAPIBearerToken'),
        'extra_headers_dict': None
    }

def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    credentials = load_twitter_credentials()

    logging.info(f'Twitter credentials: {credentials}')
    logging.info('Python timer trigger function ran at %s', utc_timestamp)
