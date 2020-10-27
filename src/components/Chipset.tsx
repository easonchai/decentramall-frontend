import React from "react";
import WeekendIcon from '@material-ui/icons/WeekendRounded';
import BeenhereRoundedIcon from '@material-ui/icons/BeenhereRounded';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';
import { Chip } from "@material-ui/core";

interface Props {
    status: "unstaked" | "staked" | "rented";
}

export default function Chipset(props: Props){
    return(
        <Chip 
            icon={
                props.status === "unstaked" ?
                    <WeekendIcon fontSize="large" style={{color: 'white'}}/> :
                        props.status === "staked" ?
                            <HomeWorkRoundedIcon fontSize="large" style={{color: 'white'}} /> :
                                <BeenhereRoundedIcon fontSize="large" style={{color: 'white'}} />
            } 
            label={props.status.toUpperCase()}
            style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                background: props.status === "unstaked" ? '#FF9800': props.status === "staked" ? '#2196F3' : '#4CAF50',
                width: '150px'
            }}
            /> 
    )
}