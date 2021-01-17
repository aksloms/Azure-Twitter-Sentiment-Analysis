import React from 'react';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import MainPlot from '../recources/main_plot.jpg'
import FirstPlot from '../recources/first_plot.png'
import SecPlot from '../recources/sec_plot.jpeg'


const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: "center",
        marginLeft: "10%",
        marginRight: "10%"
    },
    plot_container: {
        height: "75%",
        position: "fixed",
        bottom: 0
    },
    remove_space: {
        position: "relative",
        padding: 0,
        margin: 0
    },
    menuButton: {
        width: "80%",
        height: "15%",
        position: "absolute",
        bottom: 0
    },
    button: {
        textAlign: "center",
        width: "100%",
        height: "100%"
    }
}));

var backgroundStyleMainPlot = {
    backgroundImage: `url(${MainPlot})`,
    width: "100%",
    height: "100%",
}

var backgroundStyleFirstPlot = {
    backgroundImage: `url(${FirstPlot})`,
    width: "100%",
    height: "100%",
}

var backgroundStyleSecPlot = {
    backgroundImage: `url(${SecPlot})`,
    width: "100%",
    height: "100%",
}


export default function Home() {
    const classes = useStyles();

    return (
        <React.Fragment>

            <Typography className={classes.title}>
                <h1>
                    Analiza sentymentu oparta o wskazany aspekt
                </h1>
                <h3>
                    Aplikacja pozwalająca na zwizualizowanie zmieniających się nastrojów komentarzy na Twitter w zależności od ustalonyego hashtag oraz słów wpływających na zmianę sentymentu treści wpisu
                </h3>
            </Typography>

            <Grid container className={classes.plot_container}>

                <Grid item xs={6}>
                    <Container style={backgroundStyleMainPlot}>
                    </Container>
                </Grid>

                <Grid item xs={6}>
                    <Grid container className={classes.plot_container}>

                        <Grid item xs={12}>
                            <Container className={classes.remove_space} style={backgroundStyleFirstPlot}>
                                <div className={classes.menuButton}>

                                    <Button className={classes.button} variant="contained" color="primary" href="/plot/sentiment" >
                                        Analiza sentymentu
                                    </Button>
                                </div>
                            </Container>
                        </Grid>

                        <Grid item xs={12}>
                            <Container className={classes.remove_space} style={backgroundStyleSecPlot}>
                                <div className={classes.menuButton}>

                                    <Button className={classes.button} variant="contained" color="primary" href="/plot/sentiment" >
                                        Analiza aspektu
                                    </Button>
                                </div>
                            </Container>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>

        </React.Fragment>

    );
}