import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';

import FirstPlot from '../resources/first_plot.png'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import GitHubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: 10,
        width: 200
    },
    section: {
        display: 'flex',
        justifyContent: 'center'
    },
    card: {
        maxWidth: 1320,
        marginTop: 15

    },
    media: {
        width: 1290,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    h5: {
        color: '#FFFFFF',
        marginBottom: 30,
        marginTop: 50,
    },
    h2: {
        paddingTop: 80,
        color: '#FFFFFF',
    },
    content: {
        textAlign: "center",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 30,
        marginBottom: 30
    }
}));

export default function Home() {
    const classes = useStyles();
    return (
        <div className={classes.section}>
            <Card className={classes.card}>

                <CardMedia
                    className={classes.media}
                    image={FirstPlot}
                >
                    <Typography color="inherit" align="center" variant="h2" marked="center" className={classes.h2}>
                        Analiza sentymentu tweetów
                    </Typography>
                    <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
                        Aplikacja wizualizująca sentyment tweetów w języku polskim
                    </Typography>
                    <Button
                        variant="contained"
                        size={"large"}
                        className={classes.button}
                        component="a"
                        href="/plot/sentiment"
                    >
                        Analiza
                    </Button>
                </CardMedia>
                <CardContent className={classes.content}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Cel projektu
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Aplikacja pozwalająca na zwizualizowanie zmieniających się nastrojów komentarzy na Twitter w
                        zależności od ustalonego hashtag oraz słów wpływających na zmianę sentymentu treści wpisu.
                    </Typography>

                    <Typography gutterBottom variant="h5" component="h2" style={{paddingTop: "40px"}}>
                        Repozytorium projektu
                    </Typography>
                    <Button
                        variant="contained"
                        size={"large"}
                        component="a"
                        href="https://github.com/aksloms/Azure-Twitter-Sentiment-Analysis"
                        startIcon={<GitHubIcon/>}
                    >
                        Github
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}