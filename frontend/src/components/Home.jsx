import React from 'react';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';


import Background from '../recources/background_home.jpg'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    contentContainer: {
        textAlign: "center"
    }
}));

var backgroundStyle= { 
    backgroundImage: `url(${Background})`,
    width: "100%",
    height: "800px",
    position: 'absolute'
}


export default function Home() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={classes.contentContainder} style={backgroundStyle}>
            <Typography>
                Jakiś fajny opis
            </Typography>
            </Container>
        </React.Fragment>
    );
}