import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles'
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from '@material-ui/icons/Delete';
import ForwardTwoToneIcon from '@material-ui/icons/ForwardTwoTone';
import {Container, IconButton} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import Typography from "@material-ui/core/Typography";

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
    plotParamsPick: {
        padding: 0,
        display: "flex",
        //justifyContent: 'center',
    },
    icon: {
        fontSize: 40,
        //position: "absolute",
        display: 'block'
    },
    titlePos: {
        margin: 15,
        textAlign: "right",
        marginLeft: "auto"
    },
    titleContainer: {
        display: "flex"
    },
    aspectButton: {
        marginTop: "auto",
        marginBottom: "auto",
        height: "40px"
    }
}));


export default function AnalysisSpecifier(props) {
    var componentTypeElements = {}
    if (props.type === 'sentiment') {
        componentTypeElements.name = "Wybór hashtaga"
        componentTypeElements.title = "Wybór hashtagów"
        componentTypeElements.href = "/plot/aspect"
        componentTypeElements.cacheStorage = "pickedHashtags"
        componentTypeElements.buttonAddText = "Dodaj kolejny hashtag"
        componentTypeElements.buttonLinkText = "Analiza aspektu"
    } else {
        componentTypeElements.name = "Wybór aspektu"
        componentTypeElements.title = "Wybór aspektów"
        componentTypeElements.href = "/plot/sentiment"
        componentTypeElements.cacheStorage = "pickedAspects"
        componentTypeElements.buttonAddText = "Dodaj kolejny aspekt"
        componentTypeElements.buttonLinkText = "Analiza sentymentu"
    }

    const classes = useStyles();


    const determineAutocompleteChosenValues = () => {
        if (props.type === 'sentiment') {
            var cachedArrOfChosenAutocomplete = JSON.parse(sessionStorage.getItem(componentTypeElements.cacheStorage))
            return cachedArrOfChosenAutocomplete || [];
        }
        return [];
    }
    const [autocompleteChosenValues] = React.useState(determineAutocompleteChosenValues());

    const options = props.optionsArray == null ? [" "] : props.optionsArray;
    const PlotParamsAutocomplete = (key, value) => {
        return (
            <Container key={key} className={classes.plotParamsPick}>
                <Autocomplete
                    className={classes.autocomplete}
                    options={options}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label={componentTypeElements.name}
                                                        variant="outlined"/>}
                    onChange={(event, value) => {
                        handleComboBoxChange(event, value, key)
                    }}
                    value={value}
                />
                {props.type === 'sentiment' && <Button
                    className={classes.aspectButton}
                    variant="contained"
                    endIcon={<ForwardTwoToneIcon/>}
                    onClick={() => {sessionStorage.setItem('chosenAspectHashtag', autocompleteChosenValues[key])}}
                    href="/plot/aspect"> Aspekt
                </Button>}

                {(key !== 0) && (<IconButton onClick={() => {
                    removeOptionPicker(key)
                }}>
                    <DeleteIcon className={classes.icon}/>
                </IconButton>)}
            </Container>
        );
    }

    const setNumOfAutocomplete = () => {
        var autocompleteCachedValues = sessionStorage.getItem(componentTypeElements.cacheStorage)
        if (autocompleteCachedValues) {
            const num = JSON.parse(autocompleteCachedValues).length
            return [...Array(num)].map(() => PlotParamsAutocomplete)
        }
        return [PlotParamsAutocomplete]
    }
    const [autocompleteOptionsList, setAutocompleteOptionsList] = useState(setNumOfAutocomplete());

    const removeOptionPicker = (key) => {
        autocompleteChosenValues.splice(key, 1) //Usuwa element
        autocompleteOptionsList.splice(key, 1)
        props.setChosenAutocomplete(autocompleteChosenValues);
    }

    const handleComboBoxChange = (event, value, key) => {
        autocompleteChosenValues[key] = value;
        props.setChosenAutocomplete(autocompleteChosenValues);
        sessionStorage.setItem(componentTypeElements.cacheStorage, JSON.stringify(autocompleteChosenValues));
    };

    const addHashtagPicker = () => {
        setAutocompleteOptionsList([...autocompleteOptionsList, PlotParamsAutocomplete])
        autocompleteChosenValues.push();
    }

    return (
        <Grid item className={classes.gridItem}>
            <Card className={classes.card}>
                <CardContent>
                    <Container className={classes.titleContainer}>
                        <ListIcon className={classes.icon}/>
                        <Typography className={classes.titlePos} color="textSecondary">
                            {componentTypeElements.title}
                        </Typography>
                    </Container>
                    {props.type === 'aspect' && <Typography variant="h5" component="h2" style={{"padding": "10px 24px"}}>
                        Aspekty dla: {props.chosenHashtag}
                    </Typography>}
                    {autocompleteOptionsList.map((item, key) => {
                        var value = autocompleteChosenValues[key]
                        if (value === undefined)
                            value = ""
                        return (PlotParamsAutocomplete(key, value));
                    })}
                    <Button className={classes.button} variant="contained" color="primary" onClick={addHashtagPicker}>
                        {componentTypeElements.buttonAddText}
                    </Button>
                    {props.type === 'aspect' && <Button className={classes.button} variant="contained" color="secondary"
                                                        href={componentTypeElements.href}>
                        {componentTypeElements.buttonLinkText}
                    </Button>}
                </CardContent>
            </Card>
        </Grid>
    );
}