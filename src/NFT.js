import React from 'react';

function NFT(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
            <img width="100" height="100" src={props.src} />
        </div>
    )
}

export default NFT;
