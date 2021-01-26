import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';

import PlotItem from './PlotItem'
import AnalysisSpecifier from './AnalysisSpecifier'
import DatePicker from "./DatePicker";
import FetchData from "../services/FetchData.service"
import SmallGridItem from './SmallGridItem'


const useStyles = makeStyles((theme) => ({
    grid: {
        margin: "15px",
        maxWidth: "1320px",
        flexWrap: 'wrap',
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        fontSize: 14,
    },
    icon: {
        fontSize: 40,
        display: 'block',
    },
}));

const defaultLayout = {
    width: 630,
    height: 440,
    yaxis: { range: [0, 1] },
    legend: {
        x: 0,
        y: 1,
    },
    margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
    }
}
export default function SentimentPlot() {
    const classes = useStyles();
    const [availableHashtags, setAvailableHashtags] = React.useState();
    const [hashtags, setHashtags] = React.useState(
        JSON.parse(sessionStorage.getItem('pickedHashtags')) || []
    );
    const [plotData, setPlotData] = React.useState([]);
    const [date, setDate] = React.useState([new Date('2021-01-05'), new Date()]);

    const [averageSentimentForHashtag, setAverageSentimentForHashtag] = React.useState([]);
    const [numOfHashtags, setNumOfHashtags] = React.useState();

    const fetchHashtagInfo = () => {
        var averagesForHashtags = [];
        var hashCount = 0
        var validHashtags = [...new Set(hashtags.filter(Boolean))];
        validHashtags.forEach((value) => {
            FetchData.getHashtagAverage(
                value,
                date[0].toISOString().split(".")[0],
                date[1].toISOString().split(".")[0]
            ).then((response) => {
                if (response && response.data) {
                    averagesForHashtags.push([value, response.data.sentiment.toFixed(3)])
                    hashCount = hashCount + response.data.count
                }
                setNumOfHashtags(hashCount)
                setAverageSentimentForHashtag(averagesForHashtags)
            });
        });

    }

    const fetchHashtagPlot = () => {
        var fetchedData = [];
        var validHashtags = [...new Set(hashtags.filter(Boolean))];
        validHashtags.forEach((value) => {
            FetchData.getSentimentForHashtag(
                value,
                date[0].toISOString().split(".")[0],
                date[1].toISOString().split(".")[0],
                100
            ).then((response) => {
                if (response && response.data) {
                    const trace = {
                        x: response.data.dates,
                        y: response.data.sentiments,
                        type: 'scatter',
                        showlegend: true,
                        name: value,
                    };
                    fetchedData = [...fetchedData, trace]
                }
                setPlotData(fetchedData);
            });
        });
    }

    useEffect(() => {
        fetchHashtagPlot()
        fetchHashtagInfo()
    }, [hashtags, date]);

    useEffect(() => {
        FetchData.getHashtags().then((response) => {
            setAvailableHashtags(response.data.hashtags);
        });
    }, []);
    
    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon} />} title={"Przeanalizowane tweety"}
                    numOfTweets={numOfHashtags} />
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon} />} title={"Średni sentyment dla hashtagów:"}
                    hashtagArray={averageSentimentForHashtag} />
                <DatePicker onDateChange={(newDate) => setDate([...newDate])} />
                <PlotItem
                    layout={defaultLayout}
                    data={plotData}
                    title="Analiza sentymentu dla wybranych hashtagów"
                />
                <AnalysisSpecifier
                    optionsArray={availableHashtags}
                    type="sentiment"
                    setChosenAutocomplete={(newHashtags) => setHashtags([...newHashtags])} />
            </Grid>
        </div>
    );
}