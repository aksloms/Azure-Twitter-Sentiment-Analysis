import axios from "axios";

const API_URL = "http://backendas-pw.azurewebsites.net"

const makeRequest = (url, params) => {
    return axios.get(url,{
        params: params
    }).then((response) => {
        return response;
    }).catch((error) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return Promise.reject(error);
    });
}

const getSentimentForHashtag = (hashtag, startDate, endDate, bins) => {
    const endpoint = "/binned-sentiment"
    const params = {
        hashtag: hashtag,
        start_date: startDate,
        end_date: endDate,
        bins: bins
    }
    const url = API_URL + endpoint
    return makeRequest(url, params);
};

const getHashtagAverage = (hashtag, startDate, endDate) => {
    const endpoint = "/average-sentiment"
    const params = {
        hashtag: hashtag,
        start_date: startDate,
        end_date: endDate,
    }
    const url = API_URL + endpoint
    return makeRequest(url, params);
};

const getHashtags = () => {
    const endpoint = "/hashtags"
    return axios.get(API_URL + endpoint);
}

export default {
    getSentimentForHashtag,
    getHashtagAverage,
    getHashtags
};