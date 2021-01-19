import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';
import Plot from 'react-plotly.js';

import DateAndTagPicker from './DateAndTagPicker'


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
        position: "absolute"
    },
    button: {
        width: "100%",
        marginTop: 10
    }
}));


export default function SentimentPlot() {
    const classes = useStyles();

    const SmallGridItem = (props) => {
        return (
            <Grid item className={classes.gridItem}>
                <Card className={classes.card}>
                    <CardContent>
                        {/*<TrendingUpIcon className={classes.icon}/>*/}
                        {props.icon}
                        <Typography className={classes.pos} color="textSecondary">
                            {props.title}
                        </Typography>
                        <Typography variant="h3" component="p" className={classes.pos}>
                            {props.text}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const PlotItem = (props) => {
        return (
            <Grid item className={classes.plotItem}>
                <Card className={classes.card}>
                    <CardContent className={classes.plotCardContent}>
                        <Plot
                            data={props.data}
                            layout={props.layout}
                        />
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const ComboBox = (props) => {
        return (
            <Autocomplete
                id="combo-box-demo"
                options={props.dataArray}
                getOptionLabel={(option) => option}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label={props.name} variant="outlined" />}
            />
        );
    }
    //Na sztywno ustawione dane
    const tagArray = [
        '#Hot16',
        '#Lewy',
        '#PolishBoy',
        '#PWGoals',
    ]

    const aspectArray = [
        'COVID',
        'Szcepionka',
        'Polityka',
        'Trump',
    ]

    var trace1 = {
        x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
        y: [10, 15, 13, 17],
        type: 'scatter'
    };

    var trace2 = {
        x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
        y: [16, 5, 11, 9],
        type: 'scatter'
    };

    var numOfTweets = 1500;
    var interestingNumbers = 1234;

    //Sprawdzenie działania bardziej szczegółowego czasu
    // var trace1 = {
    //     x: ['1999-01-11 12:12:13', '1999-01-11 12:12:14', '1999-01-11 12:12:15', '1999-01-11 12:12:16'],
    //     y: [10, 15, 13, 17],
    //     type: 'scatter'
    // };

    // var trace2 = {
    //     x: ['1999-01-11 12:12:13', '1999-01-11 12:12:14', '1999-01-11 12:12:15', '1999-01-11 12:12:16'],
    //     y: [16, 5, 11, 9],
    //     type: 'scatter'
    // };

    var layout = {
        width: 630,
        height: 440,
        title: 'A Fancy Plot'
    }

    var data = [trace1, trace2];
    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon} />} title={"Przeanalizowane tweety"}
                    text={numOfTweets} />
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon} />} title={"Inne ciekawe liczby"}
                    text={interestingNumbers} />
                <DateAndTagPicker />
                <PlotItem layout={layout} data={data} />
                <Grid item className={classes.plotItem}>
                    <Card className={classes.card}>
                            <ComboBox dataArray={tagArray} name="Wybór hashtag" />
                            <ComboBox dataArray={aspectArray} name="Wybór aspektu" />
                            <Button className={classes.button} variant="contained" color="primary" href="/plot/sentiment" >
                                Analiza sentymentu
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}