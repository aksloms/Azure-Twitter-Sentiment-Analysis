from flask import app, Flask
from flask_restful import Api

from SampleTweets import SampleTweets

app = Flask(__name__)
api = Api(app)


api.add_resource(SampleTweets, '/',)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
