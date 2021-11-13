import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

function NFT(props) {
    const [ loading, setLoading ] = useState(true);

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
        <div className="NFT">
            <div>
                <div>
                    {props.data.animation_url == null ?
                    <div style={{margin: "auto"}}>
                        <CircularProgress 
                            style={loading === false ? {display: "none"} : {}}
                            width="100%"
                        />
                        <img 
                            width="100%" 
                            src={fixUrl(props.data.image)} 
                            alt={props.data.name}
                            style={loading === true ? {display: "none"} : {}}
                            onLoad={() => {
                                setLoading(false);
                            }}
                        />
                    </div>
                    :
                    <video 
                        width="100%" 
                        src={fixUrl(props.data.animation_url)} 
                        controls 
                        poster={fixUrl(props.data.image)} 
                        alt={props.data.name}
                    >
                    </video>
                    }
                    <h2 className="heading">{props.data.name}</h2>
                    <p>{props.data.description}</p>
                    <button className="ops-button">
                        <a style={{textDecoration: 'none', color: 'white'}} target="_blank" rel="noreferrer" href={'https://opensea.io/assets/' + props.data.token_address + '/' + props.data.token_id}>
                           OpenSea
                        </a>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NFT;
