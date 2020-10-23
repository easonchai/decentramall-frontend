import { Button, Input, makeStyles, Slider, Typography } from '@material-ui/core';
import React from 'react';
import EtherService from '../services/EtherService';

const useStyles = makeStyles({
    root: {
      width: 250,
    },
    input: {
      width: 42,
    },
  });
  
export default function Admin() {
    const classes = useStyles();
    let etherService = EtherService.getInstance();
    const [value, setValue] = React.useState(30);

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setValue(newValue);
      };
    
      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : parseInt(event.target.value));
      };
    
      const handleBlur = () => {
        if (value < 0) {
          setValue(0);
        } else if (value > 100) {
          setValue(100);
        }
      };

    const callbackFn = (result: any) => {
        console.log("cb fn ", result);
    }

    const mintDai = () => {
        etherService.mint("0x7371F37B1eCEC1e859285d31DAeE4380F20A412E", (value*Math.pow(10, 18)).toString(), callbackFn)
            .then((val) => console.log(val.toString()))
            .catch((err: any) => console.error(err));
    }

    return(
        <div>
            <Typography component="h1">Hey Admin!</Typography>
            <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
            />
            <Input
                className={classes.input}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                step: 10,
                min: 0,
                max: 1000,
                type: 'number',
                'aria-labelledby': 'input-slider',
                }}
            />
            <Button onClick={() => mintDai()}>
                Mint Dai
            </Button>
        </div>
    )
}