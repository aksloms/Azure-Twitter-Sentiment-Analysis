import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Slider } from "@material-ui/core";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

const useStyles = makeStyles((theme) => ({
    plotItem: {
        padding: "15px",
    },
    largeCard: {
        minWidth: 630,
    },
    largeCardContent: {
        padding: "15px",
    },
    icon: {
        fontSize: 40,
        position: "absolute"
    },
    warningDate: {
        textAlign: "center",
        color: "#E56717",
        fontSize: 12,
    },
    dateContent: {
        paddingTop: 30
    },
}));

export default function DateAndTagPicker() {
    const classes = useStyles();

    const [value, setValue] = React.useState([10, 90]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedFirstDate, setSelectedFirstDate] = React.useState(new Date('2021-01-11'));
    const [selectedSecDate, setSelectedSecDate] = React.useState(new Date('2021-01-12'));

    const [firstDateWarning, setFirstDateWarning] = React.useState(false);
    const [secDateWarning, setSecDateWarning] = React.useState(false);

    const handleFirstDateChange = (date) => {
        if (date.getTime() <= selectedSecDate.getTime()) {
            setSelectedFirstDate(date);
        } else {
            setFirstDateWarning(true)
            setTimeout(function () { setFirstDateWarning(false); }, 2000)
        }
    };

    const handleSecDateChange = (date) => {
        if (date.getTime() >= selectedFirstDate.getTime()) {
            setSelectedSecDate(date);
        } else {
            setSecDateWarning(true)
            setTimeout(function () { setSecDateWarning(false); }, 2000)
        }
    };

    return (<Grid item className={classes.plotItem}>
        <Card className={classes.largeCard}>
            <CardContent className={classes.largeCardContent}>

                <TrendingUpIcon className={classes.icon} style={{ display: 'block' }} />
                {firstDateWarning && <Typography className={classes.warningDate}>
                    Wskazana data początkowa pozostaje w konflikcie z końcową
                </Typography>}

                {secDateWarning && <Typography className={classes.warningDate}>
                    Wskazana data końcowa pozostaje w konflikcie z początkową
                </Typography>}

                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <div style={{ textAlign: 'center' }} className={classes.dateContent}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Data początkowa"
                            value={selectedFirstDate}
                            onChange={handleFirstDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{ padding: "15px" }}
                            autoOk={true}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Data końcowa"
                            value={selectedSecDate}
                            onChange={handleSecDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{ padding: "15px" }}
                            autoOk={true}
                        />
                        <Typography id="range-slider" gutterBottom>
                            Zakres dat:
                        </Typography>
                        <Slider
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                        />
                    </div>
                </MuiPickersUtilsProvider>
            </CardContent>
        </Card>
    </Grid>)
}