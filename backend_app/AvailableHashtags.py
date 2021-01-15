from azure.data.tables import TableClient
from flask_restful import Resource
from config import CONNECTION_STRING, TABLE_NAME


class AvailableHashtags(Resource):
    client = TableClient.from_connection_string(
        conn_str=CONNECTION_STRING,
        table_name=TABLE_NAME)

    def get(self):
        tweet_rows = self.client.query_entities(
            filter="",
            select=[u"SearchHashtag"])

        hashtags = set()
        for t in tweet_rows:
            hashtags.add(t["SearchHashtag"])

        return {"hashtags": list(hashtags)}
