import React, { useState } from 'react';
import NFT from './NFT';
import AuctionChart from './AuctionChart';
import { ellipsisAddress } from '../utilities';
import { HashLink as Link} from 'react-router-hash-link';
import { Grid } from '@mui/material';


// A featured auction is a big NFT alongside an auction chart
function FeaturedAuction(props) {
    const [ loading, setLoading ] = useState(true);
    const FEATUERED_AUCTION_ID = 31;
    const FEATURED_ID = "3oCAjhyyziGwgFzpr6olZ2FK";

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
            <Grid container spacing={2}>
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
                <div className="nes-container">
                    <h3>{props.data.name}</h3>
                    <p>"{props.data.description}"</p>
                    <Link to={`/auction/${FEATURED_ID}`}>
                        <button className="ops-button">View Auction</button>
                    </Link>
                </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default FeaturedAuction;
