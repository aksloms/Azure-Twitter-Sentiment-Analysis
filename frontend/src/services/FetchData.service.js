import axios from "axios";

const API_URL = "http://backendas-pw.azurewebsites.net"

const getSentimentForHashtag = (hashtag, startDate, endDate, bins) => {
    const endpoint = "/binned-sentiment?"
    const qHashtag = "hashtag=%23" + hashtag + "&";
    const qStartDate = "start_date=" + startDate + "&";
    const qEndDate = "end_date=" + endDate + "&";
    const qBins = "bins=" + bins;
    return axios.get(API_URL + endpoint + qHashtag + qStartDate + qEndDate + qBins,
    ).then((response) => {
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
};

const getHashtags = () => {
    const endpoint = "/hashtags"
    return axios.get(API_URL + endpoint);
}

export default {
    getSentimentForHashtag,
    getHashtags
};