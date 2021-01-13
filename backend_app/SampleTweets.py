from azure.data.tables import TableClient
from flask import request
from flask_restful import Resource


class SampleTweets(Resource):
    client = TableClient.from_connection_string(
        conn_str="",
        table_name="LabeledTweets")

    def get(self):
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        count = int(request.args.get("count"))

        entities = self.client.query_entities(
            filter="CreatedAt ge datetime'" + start_date + "' and CreatedAt lt datetime'" + end_date + "'",
            select=[u"SearchHashtag", u"Text", u"CognitiveServicesSentimentScore"])

        response_content = []
        i = 0
        for e in entities:
            del e["_metadata"]
            response_content.append(e)
            if i == count:
                break

            i += 1

        return response_content
