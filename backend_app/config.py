from dotenv import load_dotenv
from os import getenv


load_dotenv()
CONNECTION_STRING = getenv("CONNECTION_STRING")
TABLE_NAME = "LabeledTweets"
