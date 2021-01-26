import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';

import PlotItem from './PlotItem'
import AnalysisSpecifier from './AnalysisSpecifier'
import DatePicker from "./DatePicker";
import FetchData from "../services/FetchData.service"


const useStyles = makeStyles((theme) => ({
    grid: {
        margin: "15px",
        //width: "unset",
        //justifyContent: "center",
        maxWidth: "1320px",
        flexWrap: 'wrap',
        marginLeft: "auto",
        marginRight: "auto",
    },
    gridItem: {
        padding: "15px"
    },
    card: {
        minWidth: 300,
        minHeight: 280
    },
    title: {
        fontSize: 14,
    },
    smallGridContainer: {
        padding: 0,
        height: 50,
        display: 'flex',
        position: 'relative'
    },
    smallGridTitle: {
        marginBottom: 8,
        textAlign: "left",
    },
    hashtagName: {
        marginBottom: 4,
        position: "absolute",
        top: 6,
        left: 0
    },
    hashtagSentimentGreen: {
        marginBottom: 4,
        position: "absolute",
        right: 0,
        color: "#00ff00"
    },
    hashtagSentiment: {
        marginBottom: 4,
        position: "absolute",
        right: 0,
        color: "red"
    },
    icon: {
        fontSize: 40,
        display: 'block',
    },
}));

const defaultLayout = {
    width: 630,
    height: 440,
    //title: "A plot for hashtags: ",
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
        JSON.parse(sessionStorage.getItem('pickedHashtags')) || ["#COVID19"]
    );
    const [plotData, setPlotData] = React.useState([]);
    const [date, setDate] = React.useState([new Date('2021-01-05'), new Date()]);

    const [averageSentimentForHashtag, setAverageSentimentForHashtag] = React.useState([]);
    const [numOfHashtags, setNumOfHashtags] = React.useState(0);

    const fetchHashtagInfo = () => {
        var averagesForHashtags = [];
        var hashCount = 0
        var validHashtags = [...new Set(hashtags.filter(Boolean))]; //usuniecie nulli i duplikatów
        validHashtags.forEach((value) => {
            FetchData.getHashtagAverage(
                value,
                date[0].toISOString().split(".")[0],//usuwa milisekundy z daty
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
        var validHashtags = [...new Set(hashtags.filter(Boolean))]; //usuniecie nulli i duplikatów
        validHashtags.forEach((value) => {
            FetchData.getSentimentForHashtag(
                value,
                date[0].toISOString().split(".")[0],//usuwa milisekundy z daty
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

    const SmallGridItem = (props) => {
        return (
            <Grid item className={classes.gridItem}>
                <Card className={classes.card}>
                    <CardContent style={{ padding: "15px" }}>
                        {props.icon}
                        <Typography className={classes.smallGridTitle} color="textSecondary">
                            {props.title}
                        </Typography>
                        {props.numOfTweets &&
                            <Typography variant="h3" component="p" >
                                {props.numOfTweets}
                            </Typography>
                        }
                        {props.hashtagArray && props.hashtagArray.map((value, index) => {
                            return (
                                <Container className={classes.smallGridContainer} key={index}>
                                    <Typography variant="h5" component="p" className={classes.hashtagName}>
                                        {value[0]}
                                    </Typography>
                                    {value[1] >= 0.5 &&
                                        <Typography variant="h4" component="p" className={classes.hashtagSentimentGreen}>
                                            {value[1]}
                                        </Typography>
                                    }
                                    {value[1] < 0.5 &&
                                        <Typography variant="h4" component="p" className={classes.hashtagSentimentRed}>
                                            {value[1]}
                                        </Typography>
                                    }
                                </Container>
                            )
                        })}
                    </CardContent>
                </Card>
            </Grid>
        );
    }

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