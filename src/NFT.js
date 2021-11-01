import React from 'react';

function NFT(props) {
    const fixUrl = url => {
        if (url === "" || url ==="#" || url === undefined || url === null) {
            return "#";
        }
        else if (url.startsWith("ipfs://ipfs/")) {
            return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs/").slice(0)[1];
        }
        else if (url.startsWith("ipfs")) {
            return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(0)[1];
        }
        else {
            return url + "?format=json";
        }
    }

    return (
        <div style={{justifyContent: "left", width: "500px"}}>
            <div>
                {props.data.animation_url == null ?
                <img width="400" src={fixUrl(props.data.image)} />
                :
                <video width="400" src={fixUrl(props.data.animation_url)} controls poster={fixUrl(props.data.image)}>
                </video>
                }
                <h4 style={{margin: "auto"}}>{props.data.name}</h4>
                <h4 style={{margin: "auto"}}>Amount: {props.data.amount}</h4>
                <p>{props.data.description}</p>
                <p><a target="_blank" rel="noreferrer" href={'https://opensea.io/assets/' + props.data.token_address + '/' + props.data.token_id}>View on OpenSea</a></p>
            </div>
        </div>
    )
}

export default NFT;
