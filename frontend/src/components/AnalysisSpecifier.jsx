import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles'
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: "15px",
  },
  card: {
    minWidth: 300,
    paddingTop: 5,
  },
  button: {
    width: "100%",
    marginTop: 10
  }
}));

export default function AlalysisSpecifier(props) {
  const classes = useStyles();

  const handleComboBoxChange = (event, value) => {
    props.setTitleValue(value)
  };

  return (
    <Grid item className={classes.gridItem}>
      <Card className={classes.card}>
        <Autocomplete
          id="combo-box-demo"
          options={props.tagArray}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label={props.name} variant="outlined" />}
          onChange={handleComboBoxChange}
          defaultValue={props.defaultValue}
        />
        <Button className={classes.button} variant="contained" color="primary" href="/plot/aspect" >
          Analiza aspektu
        </Button>
      </Card>
    </Grid >
  );
}