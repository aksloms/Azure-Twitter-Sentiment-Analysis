import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Plot from 'react-plotly.js';
import TimelineIcon from '@material-ui/icons/Timeline';
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
    plotItem: {
        padding: "15px",
    },
    card: {
        minWidth: 300,
    },
    plotCardContent: {
        padding: "16px 0px",
    },
    icon: {
        fontSize: 40,
        display: 'block'
    },
    pos: {
        margin: 15,
        textAlign: "right",
        marginLeft: "auto"
    },
    container: {
        display: "flex"
    }
}));

export default function PlotItem(props) {
    const classes = useStyles();

    return (
        <Grid item className={classes.plotItem}>
            <Card className={classes.card}>
                <CardContent className={classes.plotCardContent}>
                    <Container className={classes.container}>
                        <TimelineIcon className={classes.icon} />
                        <Typography className={classes.pos} color="textSecondary">
                            {props.title}
                        </Typography>
                    </Container>
                    <Plot
                        data={props.data}
                        layout={props.layout}
                    />
                </CardContent>
            </Card>
        </Grid>
    );
}