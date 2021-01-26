import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';
import DatePicker from "./DatePicker";

import PlotItem from './PlotItem'
import AnalysisSpecifier from './AnalysisSpecifier'
import SmallGridItem from './SmallGridItem'



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

const trace1 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [0.1, 0.5, 0.3, 0.7],
    type: 'scatter'
};

const trace2 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [0.6, 0.5, 0.1, 0.9],
    type: 'scatter'
};

const trace3 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [0.7, 0.9, 0.1, 0.4],
    type: 'scatter'
};

const numOfTweets = 200;
const averageSentimentForAspect = [["Nazwa aspektu", 0.499]];

const data = [trace1, trace2, trace3];

export default function AspectPlot() {
    const classes = useStyles();

    const [aspectHashtag] = React.useState(
        sessionStorage.getItem('chosenAspectHashtag') || "#COVID19"
    );
    const [aspects, setAspects] = React.useState([])

    const aspectArr = aspectDict[aspectHashtag]

    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon} />} title={"Przeanalizowane tweety"}
                    numOfTweets={numOfTweets} />
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon} />} title={"Średni sentyment dla aspektów:"}
                    hashtagArray={averageSentimentForAspect} />
                <DatePicker />
                <PlotItem 
                    layout={defaultLayout} 
                    data={data}
                    title="Analiza sentymenty dla wybranych aspektów" />
                <AnalysisSpecifier
                    optionsArray={aspectArr}
                    type="aspect"
                    setChosenAutocomplete={(newAspects) => setAspects([...newAspects])}/>
            </Grid>
        </div>
    );
}