# Backend Flask application

### Endpoints
Endpoint | Query string | Response parameters
---      | ---        | ---      |
**Average sentiment**<br>`/average-sentiment` | hashtag (string) <br> start_date (datetime) <br> end_date (datetime) | sentiment (float)<br>count (int)
**Current sentiment**<br>`/current-sentiment` | hashtag (string)<br> | sentiment (float)<br>count (int)
**Binned sentiment**<br>`/binned-sentiment` | hashtag (string) <br> start_date (datetime) <br> end_date (datetime) <br> bins (int) | two lists: dates (datetime) and sentiments (float)
**Sample tweets**<br>'/' | start_date (datetime) <br> end_date (datetime) <br> count (int) | list; each element contains the following fields: SearchHashtag, Text, CognitiveServicesSentimentScore
**Available Hashtags**<br>'/hashtags' | | json with one field <i>hashstags</i> - list of strings (available hashtags' names)


All datetimes in ISO 8601 format without miliseconds (e.g. 2021-01-10T12:32:20).