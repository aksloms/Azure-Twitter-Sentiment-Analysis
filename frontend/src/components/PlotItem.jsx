import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Plot from 'react-plotly.js';


const useStyles = makeStyles((theme) => ({
    plotItem: {
        padding: "15px",
    },
    card: {
        minWidth: 300,
    },
    plotCardContent: {
        padding: "0px",
    },
}));

export default function PlotItem(props) {
    const classes = useStyles();

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