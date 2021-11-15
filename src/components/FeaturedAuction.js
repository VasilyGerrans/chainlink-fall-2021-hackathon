import React, { useState } from 'react';
import NFT from './NFT';
import AuctionChart from './AuctionChart';
import { ellipsisAddress } from '../utilities';
import { Grid } from '@mui/material';


// A featured auction is a big NFT alongside an auction chart
function FeaturedAuction(props) {
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
        <div className="FeaturedAuction">
            <Grid container>
                <Grid item xs={4}>
                    <img 
                        src={fixUrl(props.data.image)} 
                        alt={props.data.name}
                        style={loading === true ? {width: "100%", display: "none"} : {width: "100%"}}
                        onLoad={() => {
                            setLoading(false);
                        }}
                    />
                </Grid>
                <Grid item xs={8}>
                        <AuctionChart 
                            Moralis={props.Moralis}
                            auctionId={0}
                            isInitialized={props.isInitialized}
                            web3={props.web3}
                        />
                </Grid>
                <Grid item md={12}>
                <div className="nes-container with-title">
                    <p className="title">{props.data.name}</p>
                    <p>{props.data.description}</p>
                </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default FeaturedAuction;
