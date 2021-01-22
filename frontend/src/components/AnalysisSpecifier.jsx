import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles'
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from '@material-ui/icons/Delete';
import { Container, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        padding: "15px",
    },
    card: {
        minWidth: 630,
        paddingTop: 5,
    },
    button: {
        width: "100%",
        marginTop: 10
    },
    autocomplete: {
        width: 300,
        padding: "15px"
    },
    hashtagPick: {
        padding: 0,
        display: "flex"
    },
    icon: {
        fontSize: 40,
        position: "relative",
    },

}));

export default function AnalysisSpecifier(props) {
    const classes = useStyles();
    const [hashtags] = React.useState([]);
    const HashtagAutocomplete = (key, value) => {
        return (
            <Container key={key} className={classes.hashtagPick}>
                <Autocomplete
                    className={classes.autocomplete}
                    options={props.tagArray}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label={props.name} variant="outlined" />}
                    onChange={(event, value) => {
                        handleComboBoxChange(event, value, key)
                    }}
                    value={value} 
                />
                <IconButton onClick={() => {
                        removeHashtagPicker(key)
                    }}>
                    <DeleteIcon className={classes.icon} />
                </IconButton>
            </Container>
        );
    }

    const [hashtagPickers, setHashtagPickers] = useState([HashtagAutocomplete]);

    const removeHashtagPicker = (key) => {
        hashtags.splice(key, 1) //Usuwa element
        hashtagPickers.splice(key, 1)
        props.getHashtags(hashtags);
    }

    const handleComboBoxChange = (event, value, key) => {
        props.setTitleValue(value)
        hashtags[key] = value;
        props.getHashtags(hashtags);
    };

    const addHashtagPicker = () => {
        setHashtagPickers([...hashtagPickers, HashtagAutocomplete])
        hashtags.push();
    }


    return (
        <Grid item className={classes.gridItem}>
            <Card className={classes.card}>
                <CardContent>
                    {hashtagPickers.map((item, key) => {
                        var value = hashtags[key]
                        if(value === undefined)
                            value = ""
                        return (HashtagAutocomplete(key, value));
                    })}
                    <Button className={classes.button} variant="contained" color="secondary" onClick={addHashtagPicker}>
                        Dodaj kolejny hashtag</Button>
                    <Button className={classes.button} variant="contained" color="primary" href="/plot/aspect">
                        Analiza aspektu
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
}