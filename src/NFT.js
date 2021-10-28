import { Button } from '@mui/material';
import React from 'react';

function NFT(props) {
    return (
        <div style={{justifyContent: "left", width: "500px"}}>
            <img width="250" src={props.src} />
            <h4 style={{margin: "auto"}}>{props.name}</h4>
            {/* <Button style={{width: "500px"}}>
            </Button> */}
        </div>
    )
}

export default NFT;
