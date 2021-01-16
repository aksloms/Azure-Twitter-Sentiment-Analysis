# Backend Flask application

### Endpoints
Endpoint | Query string | Response parameters
---      | ---        | ---      |
**Average sentiment**<br>`/average-sentiment` | hashtag (string) <br> start_date (datetime) <br> end_date (datetime) | sentiment (float)<br>count (int)
**Current sentiment**<br>`/current-sentiment` | hashtag (string)<br> | sentiment (float)<br>count (int)


All datetimes in ISO 8601 format without miliseconds (e.g. 2021-01-10T12:32:20).