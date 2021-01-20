import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Slider} from "@material-ui/core";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Tooltip from '@material-ui/core/Tooltip';
//import PropTypes from 'prop-types';
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
        position: "absolute",
        zIndex: 100,
        marginLeft: "120px"
    },
    dateContent: {
        paddingTop: 30
    },
}));

const convertToUTC = (date) => {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

export default function DatePicker() {
    const classes = useStyles();

    const start_date = new Date('2021-01-01');
    const start_date_utc = convertToUTC(start_date);

    const end_date = new Date('2021-01-30');
    const end_date_utc = convertToUTC(end_date);

    const [selectedFirstDate, setSelectedFirstDate] = React.useState(start_date);
    const [selectedSecDate, setSelectedSecDate] = React.useState(end_date);

    const [firstDateWarning, setFirstDateWarning] = React.useState(false);
    const [secDateWarning, setSecDateWarning] = React.useState(false);

    const [value, setValue] = React.useState([start_date_utc, end_date_utc]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedFirstDate(new Date(newValue[0]));
        setSelectedSecDate(new Date(newValue[1]));
    };


    const handleFirstDateChange = (date) => {
        if (date.getTime() <= selectedSecDate.getTime()) {
            setSelectedFirstDate(date);
            setValue([convertToUTC(date), value[1]])
        } else {
            setFirstDateWarning(true)
            setTimeout(function () {
                setFirstDateWarning(false);
            }, 2000)
        }
    };

    const handleSecDateChange = (date) => {
        if (date.getTime() >= selectedFirstDate.getTime()) {
            setSelectedSecDate(date);
            setValue([value[0],convertToUTC(date)])
        } else {
            setSecDateWarning(true)
            setTimeout(function () {
                setSecDateWarning(false);
            }, 2000)
        }
    };

    function valueLabelFormat(value) {
        return new Date(value).toLocaleString();
    }

    function ValueLabelComponent(props) {
        const {children, open, value} = props;

        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    return (
        <Grid item className={classes.plotItem}>
            <Card className={classes.largeCard}>
                <CardContent className={classes.largeCardContent}>

                    <TrendingUpIcon className={classes.icon} style={{display: 'block'}}/>
                    {firstDateWarning && <Typography className={classes.warningDate}>
                        Wskazana data początkowa pozostaje w konflikcie z końcową
                    </Typography>}

                    {secDateWarning && <Typography className={classes.warningDate}>
                        Wskazana data końcowa pozostaje w konflikcie z początkową
                    </Typography>}

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div style={{textAlign: 'center'}} className={classes.dateContent}>
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
                                style={{padding: "15px"}}
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
                                style={{padding: "15px"}}
                                autoOk={true}
                            />
                            <Typography id="range-slider" gutterBottom>
                                Zakres dat:
                            </Typography>
                            <Slider
                                min={start_date_utc}
                                max={end_date_utc}
                                ValueLabelComponent={ValueLabelComponent}
                                value={value}
                                getAriaValueText={valueLabelFormat}
                                valueLabelFormat={valueLabelFormat}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                            />
                        </div>
                    </MuiPickersUtilsProvider>
                </CardContent>
            </Card>
        </Grid>
    )
}