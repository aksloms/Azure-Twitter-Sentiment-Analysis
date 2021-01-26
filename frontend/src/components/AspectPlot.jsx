import React, {useEffect} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';
import DatePicker from "./DatePicker";

import PlotItem from './PlotItem'
import AnalysisSpecifier from './AnalysisSpecifier'
import SmallGridItem from './SmallGridItem'
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
    plotItem: {
        padding: "15px",
    },
    card: {
        minWidth: 300,
        minHeight: 280
    },
    plotCardContent: {
        padding: "0px",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        textAlign: "right",
    },
    icon: {
        fontSize: 40,
        display: 'block',
    },
    button: {
        width: "100%",
        marginTop: 10
    }
}));
//Sztywne dane
const aspectDict = {
    '#COVID19': ["PIS", "PO", "rząd"],
    '#vege': ["nowość", "dziwactwo", "moda"],
    '#kryzys': ["gospodarka", "minister", "rolnictwo"]
}

const defaultLayout = {
    width: 630,
    height: 440,
    yaxis: {range: [0, 1]},
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

export default function AspectPlot() {
    const classes = useStyles();

    const [aspectHashtag] = React.useState(
        sessionStorage.getItem('chosenAspectHashtag') || "#COVID19"
    );
    const [aspects, setAspects] = React.useState([]);
    const [plotData, setPlotData] = React.useState([]);
    const [aspectList, setAspectList] = React.useState([]);
    const [date, setDate] = React.useState([new Date('2021-01-05'), new Date()]);

    const [averageSentimentForAspect, setAverageSentimentForAspect] = React.useState([]);
    const [numOfTweets, setNumOfTweets] = React.useState();

    const getAspectList = () => {
        FetchData.getAspectsForHashtags(aspectHashtag, date[0], date[1], 100).then((response) => {
            setAspectList(Object.keys(response).slice(1));
        })
    }

    const getAspects = () => {
        var fetchedData = [];
        var avgSentForHashtag = [];
        var validAspects = [...new Set(aspects.filter(Boolean))];
        FetchData.getAspectsForHashtags(aspectHashtag, date[0], date[1], 100).then((response) => {
            if (response) {
                validAspects.forEach((aspect) => {
                    const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
                    const avgAspect = [aspect, arrAvg(response[aspect])]
                    avgSentForHashtag.push(avgAspect);
                    const trace = {
                        x: response["x"],
                        y: response[aspect],
                        type: 'scatter',
                        showlegend: true,
                        name: aspect,
                    };
                    fetchedData = [...fetchedData, trace]
                })
            }
            setPlotData(fetchedData);
            setAverageSentimentForAspect(avgSentForHashtag);
        })
    }

    useEffect(() => {
        getAspectList();
    }, []);

    useEffect(() => {
        getAspects();
    }, [aspects, date]);

    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon}/>} title={"Przeanalizowane tweety"}
                               numOfTweets={numOfTweets}/>
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon}/>}
                               title={"Średni sentyment dla aspektów:"}
                               hashtagArray={averageSentimentForAspect}/>
                <DatePicker onDateChange={(newDate) => setDate([...newDate])}/>
                <PlotItem
                    layout={defaultLayout}
                    data={plotData}
                    title="Analiza sentymenty dla wybranych aspektów"/>
                <AnalysisSpecifier
                    optionsArray={aspectList}
                    type="aspect"
                    setChosenAutocomplete={(newAspects) => setAspects([...newAspects])}
                    chosenHashtag={aspectHashtag}/>
            </Grid>
        </div>
    );
}