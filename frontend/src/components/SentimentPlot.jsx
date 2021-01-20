import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import 'date-fns';


import PlotItem from './PlotItem'
import AnalysisSpecifier from './AnalysisSpecifier'
import DatePicker from "./DatePicker";


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
}));

const defaultLayout = {
    width: 630,
    height: 440,
    title: "A plot for hashtags: "
}

const trace1 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [10, 15, 13, 17],
    type: 'scatter'
};
const trace2 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [10, 18, 22, 24],
    type: 'scatter'
};
const trace3 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [10, 17, 17, 19],
    type: 'scatter'
};
const trace4 = {
    x: ['1999-01-11', '2000-02', '2000-03', '2000-04'],
    y: [9, 10, 11, 12],
    type: 'scatter'
};

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

const defaultData = [trace1, trace2, trace3, trace4];

const tagArray = [
    '#Hot16',
    '#Lewy',
    '#PolishBoy',
    '#PWGoals',
]

export default function SentimentPlot() {
    const classes = useStyles();
    const [titleValue, setTitleValue] = React.useState(tagArray[0])
    const [plot, setPlot] = React.useState(<PlotItem layout={defaultLayout} data={[]} />)

    const SmallGridItem = (props) => {
        return (
            <Grid item className={classes.gridItem}>
                <Card className={classes.card}>
                    <CardContent>
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

    function setData(hashtags){
        //fetch data
        const newData = [];
        for(var i = 0; i < hashtags.length; i++){
            newData.push(defaultData[tagArray.indexOf(hashtags[i])]);
        }
        const newLayout = defaultData;
        newLayout.title =  "A plot for hashtags: " + hashtags.toString();
        setPlot(<PlotItem layout={newLayout} data={newData} />)
    }

    return (
        <div>
            <Grid container className={classes.grid}>
                <SmallGridItem icon={<TrendingUpIcon className={classes.icon} />} title={"Przeanalizowane tweety"}
                    text={"1500"} />
                <SmallGridItem icon={<LocalOfferIcon className={classes.icon} />} title={"Inne ciekawe liczby"}
                    text={"1234"} />
                <DatePicker />
                {plot}
                <AnalysisSpecifier 
                    tagArray={tagArray} 
                    name="Wybór hashtaga"
                    setTitleValue={setTitleValue}
                    getHashtags={setData}
                    defaultValue={titleValue}/>
            </Grid>
        </div>
    );
}