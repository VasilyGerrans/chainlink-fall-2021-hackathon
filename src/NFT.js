import React from 'react';

function NFT(props) {
    return (
        <div style={{justifyContent: "left", width: "500px"}}>
            {props.src === "#" ?
            <h1>{props.name}</h1>
            :
            <div>
                <img width="250" src={props.src} />
                <h4 style={{margin: "auto"}}>{props.name}</h4>
            </div>
            }
        </div>
    )
}

export default NFT;
