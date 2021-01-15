import React from 'react';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Plot from '../recources/plot.png'
import Title from './Title'

const useStyles = makeStyles((theme) => ({
    contentContainer: {
        textAlign: "center"
    }
}));


export default function FixedContainer() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="xl" className={classes.contentContainder}>
                <Title />
                <Container fixed>
                    <img src={Plot} alt="Plot" />
                </Container>
            </Container>
        </React.Fragment>
    );
}