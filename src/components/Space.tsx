import { makeStyles, Tabs, Tab } from '@material-ui/core';
import React from 'react';
import Graph from './Graph';
import Header from './Header';

const useStyles = makeStyles({
  root: {
    width: '85%', 
    margin: 'auto', 
  },
  tabs: {
      margin: '20px 0px'
  }
});

export default function Space() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
        <Header />
        <Graph />
        {/* <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            className={classes.tabs}
        >
            <Tab label="Buy" style={{fontSize: '2.4rem', fontWeight: 'bold'}}/>
            <Tab label="Rent" style={{fontSize: '2.4rem', fontWeight: 'bold'}}/>
        </Tabs> */}
    </div>
  );
}