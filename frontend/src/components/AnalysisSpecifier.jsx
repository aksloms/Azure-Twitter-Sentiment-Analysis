import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles'
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import CardContent from "@material-ui/core/CardContent";

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
    }

}));

export default function AnalysisSpecifier(props) {
    const classes = useStyles();
    const [hashtags] = React.useState([]);
    const HashtagAutocomplete = (key) => {
        return (
            <Autocomplete
                key={key}
                className={classes.autocomplete}
                options={props.tagArray}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label={props.name} variant="outlined"/>}
                onChange={(event, value) => {
                    handleComboBoxChange(event, value, key)
                }}
                //defaultValue={props.defaultValue}
            />
        )
    }

    const [hashtagPickers, setHashtagPickers] = useState([HashtagAutocomplete]);

    const handleComboBoxChange = (event, value, key) => {
        props.setTitleValue(value)
        hashtags[key] = value;
        props.getHashtags(hashtags);
    };

    const addHashtagPicker = () => {
        setHashtagPickers([...hashtagPickers, HashtagAutocomplete])
        hashtags.push();
    }

    const removeHashtagPicker = () => {
        //TODO
    }

    return (
        <Grid item className={classes.gridItem}>
            <Card className={classes.card}>
                <CardContent>
                    {hashtagPickers.map((item, key) => {
                        return (HashtagAutocomplete(key));
                    })}
                    <Button className={classes.button} variant="contained" color="secondary" onClick={addHashtagPicker}>Dodaj
                        kolejny hashtag</Button>
                    <Button className={classes.button} variant="contained" color="primary" href="/plot/aspect">
                        Analiza aspektu
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
}