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
        props.status === "unstaked" ?
            <Chip icon={<WeekendIcon />} /> :
                props.status === "staked" ?
                    <Chip icon={<HomeWorkRoundedIcon />} /> :
                        <Chip icon={<BeenhereRoundedIcon />} />
    )
}