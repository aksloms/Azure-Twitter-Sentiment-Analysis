from flask import app, Flask
from flask_restful import Api

from SampleTweets import SampleTweets
from AverageSentiment import AverageSentiment

app = Flask(__name__)
api = Api(app)


api.add_resource(SampleTweets, '/',)
api.add_resource(AverageSentiment, "/average-sentiment")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
