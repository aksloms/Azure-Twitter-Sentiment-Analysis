import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box, Container, Slider } from "@material-ui/core";
import DateRangeIcon from '@material-ui/icons/DateRange';
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
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
        minHeight: 280
    },
    largeCardContent: {
        padding: "15px",
    },
    icon: {
        fontSize: 40,
        //position: "absolute",
        display: 'block'
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
        //paddingTop: 30
    },
    titlePos: {
        margin: 15,
        textAlign: "right",
        marginLeft: "auto"
    },
    titleContainer: {
        display: "flex"
    }
    
}));

function ValueLabelComponent(props) {
    const { children, open, value } = props;
    return (
        <Tooltip open={open} enterDelay={500} leaveDelay={200} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}


const convertToUTC = (date) => {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

export default function DatePicker(props) {
    const classes = useStyles();

    const start_date = new Date('2021-01-05');
    const start_date_utc = convertToUTC(start_date);

    const end_date = new Date();
    const end_date_utc = convertToUTC(end_date);

    const [selectedFirstDate, setSelectedFirstDate] = React.useState(start_date);
    const [selectedSecDate, setSelectedSecDate] = React.useState(end_date);

    const [firstDateWarning, setFirstDateWarning] = React.useState(false);
    const [secDateWarning, setSecDateWarning] = React.useState(false);

    const [value, setValue] = React.useState([start_date_utc, end_date_utc]);

    const sliderChangeCommitted = (newValue) => {
        setValue(newValue);
        setSelectedFirstDate(new Date(newValue[0]));
        setSelectedSecDate(new Date(newValue[1]));
        props.onDateChange([new Date(newValue[0]), new Date(newValue[1])]);
    };

    const sliderChanged = (even, value) => {
        setValue(value);
    };

    const handleFirstDateChange = (date) => {
        if (date.getTime() <= selectedSecDate.getTime()) {
            setSelectedFirstDate(date);
            sliderChangeCommitted([convertToUTC(date), value[1]])
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
            sliderChangeCommitted([value[0], convertToUTC(date)])
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

    return (
        <Grid item className={classes.plotItem}>
            <Card className={classes.largeCard}>
                <CardContent className={classes.largeCardContent}>
                    <Container className={classes.titleContainer}>
                        <DateRangeIcon className={classes.icon} />
                        <Typography className={classes.titlePos} color="textSecondary">
                            Wybór przedziału czasu
                        </Typography>
                    </Container>
                    {firstDateWarning && <Typography className={classes.warningDate}>
                        Wskazana data początkowa pozostaje w konflikcie z końcową
                    </Typography>}

                    {secDateWarning && <Typography className={classes.warningDate}>
                        Wskazana data końcowa pozostaje w konflikcie z początkową
                    </Typography>}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div style={{ textAlign: 'center' }} className={classes.dateContent}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
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
                            <Box style={{ padding: '0px 17px' }}>
                                <Slider
                                    className={classes.slider}
                                    min={start_date_utc}
                                    max={end_date_utc}
                                    ValueLabelComponent={ValueLabelComponent}
                                    value={value}
                                    getAriaValueText={valueLabelFormat}
                                    valueLabelFormat={valueLabelFormat}
                                    onChange={sliderChanged}
                                    //valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    onChangeCommitted={(e, v) => sliderChangeCommitted(v)}
                                    step={12 * 60 * 60 * 1000} //co 12h
                                //marks
                                />
                            </Box>
                        </div>
                    </MuiPickersUtilsProvider>
                </CardContent>
            </Card>
        </Grid>
    )
}