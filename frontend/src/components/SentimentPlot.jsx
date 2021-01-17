import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Slider} from "@material-ui/core";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Plot from 'react-plotly.js';


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
    largeCard: {
        minWidth: 630,
    },

    largeCardContent: {
        padding: "15px",
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
    },
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

    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-01-10'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const DateAndTagPicker = (props) => {
        const [value, setValue] = React.useState([10, 90]);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        return (<Grid item className={classes.plotItem}>
            <Card className={classes.largeCard}>
                <CardContent className={classes.largeCardContent}>
                    <TrendingUpIcon className={classes.icon} style={{display: 'block'}}/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div style={{textAlign: 'center'}}>
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date picker inline"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{padding: "15px"}}
                        />
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                style={{padding: "15px"}}
                            />
                            <Typography id="range-slider" gutterBottom>
                                Zakres dat:
                            </Typography>
                            <Slider
                                value={value}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                            />
                        </div>
                    </MuiPickersUtilsProvider>
                </CardContent>
            </Card>
        </Grid>)
    }


    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
    };

    var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter'
    };

    var data = [trace1, trace2];
    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon}/>} title={"Przeanalizowane tweety"}
                               text={"1500"}/>
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon}/>} title={"Inne ciekawe liczby"}
                               text={"1234"}/>
                <DateAndTagPicker/>
                <PlotItem layout={{width: 630, height: 440, title: 'A Fancy Plot'}} data={data}/>
            </Grid>
        </div>
    );
}