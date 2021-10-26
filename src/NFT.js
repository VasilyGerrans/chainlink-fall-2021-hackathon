import { Button } from '@material-ui/core';
import React from 'react';

function NFT(props) {
    return (
        <div style={{justifyContent: "left"}}>
            <Button style={{width: "500px"}}>
                <img width="300" src={props.src} />
                <h4 style={{margin: "auto"}}>{props.name}</h4>
            </Button>
        </div>
    )
}

export default NFT;
