import React from 'react';
import { useEffect } from 'react/cjs/react.development';

function NFT(props) {
    useEffect(() => {
        console.log(props.src);
    }, []);

    return (
        <div>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
            <img width="100" height="100" src={props.src} />
        </div>
    )
}

export default NFT;