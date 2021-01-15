import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    textAlign: "center"
  },
}));

export default function TypographyTheme() {
  const classes = useStyles();

  return <div className={classes.root}>{"Poniżej przedstawiono analizę sentymentu opartego o aspekcie hashtag w postaci zmieniającego się w czasie trendu"}</div>;
}