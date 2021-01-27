import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import {Grow} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    gridItem: {
        padding: "15px"
    },
    smallGridTitle: {
        marginTop: 15,
        marginBottom: 15,
        textAlign: "center",
    },
    hashtagName: {
        marginBottom: 4,
        position: "absolute",
        top: 6,
        left: 0
    },
    smallGridContainer: {
        padding: 0,
        height: 50,
        display: 'flex',
        position: 'relative'
    },
    card: {
        minWidth: 300,
        minHeight: 280
    },
    hashtagSentimentGreen: {
        marginBottom: 4,
        position: "absolute",
        right: 0,
        color: "#00ff00"
    },
    hashtagSentimentRed: {
        marginBottom: 4,
        position: "absolute",
        right: 0,
        color: "red"
    },
}));

function SmallGridItem(props) {
    const classes = useStyles();

    const renderSentimentStatistics = () => {
        if (!props.hashtagArray)
            return ""
        return (
            props.hashtagArray.map((value, index) => {
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
            })
        )
    }

    return (
        <Grid item className={classes.gridItem}>
                <Card className={classes.card}>
                    <CardContent style={{padding: "15px"}}>
                        {props.icon}
                        <Typography className={classes.smallGridTitle} color="textSecondary">
                            {props.title}
                        </Typography>
                        {props.numOfTweets &&
                        <Typography variant="h3" component="p" style={{"textAlign": "center"}}>
                            {props.numOfTweets}
                        </Typography>
                        }
                        {renderSentimentStatistics()}
                    </CardContent>
                </Card>
        </Grid>
    );
}

export default SmallGridItem