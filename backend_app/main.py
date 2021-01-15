from flask import Flask
from flask_restful import Api

from AvailableHashtags import AvailableHashtags
from SampleTweets import SampleTweets
from AverageSentiment import AverageSentiment

app = Flask(__name__)
api = Api(app)


api.add_resource(SampleTweets, '/',)
api.add_resource(AverageSentiment, "/average-sentiment")
api.add_resource(AvailableHashtags, "/hashtags")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
