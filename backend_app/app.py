from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from AvailableHashtags import AvailableHashtags
from SampleTweets import SampleTweets
from Sentiment import AverageSentiment, CurrentSentiment, BinnedSentiment

app = Flask(__name__)
api = Api(app)
CORS(app)


api.add_resource(SampleTweets, '/',)
api.add_resource(AvailableHashtags, "/hashtags")
api.add_resource(AverageSentiment, "/average-sentiment")
api.add_resource(CurrentSentiment, "/current-sentiment")
api.add_resource(BinnedSentiment, "/binned-sentiment")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
