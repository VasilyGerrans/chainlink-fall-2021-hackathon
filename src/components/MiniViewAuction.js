import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CircularProgress, Tooltip } from '@mui/material';
import AuctionBar from './AuctionBar';

// only displays images, even for audio NFTs
// audio will be accessed in full pages

function MiniViewAuction(props) {
    return (
        <Tooltip
            title={`${props.progressPercentage}% complete ${(100 - props.closingPercentage < props.progressPercentage) ? "(closing)" : ""}`} 
            placement="top"
        >
            <div className="miniViewAuction">
                {props.image === "" ?
                <Card sx={{ maxWidth: 200 }}>
                    <CircularProgress />
                    <CardContent>
                        <Typography>
                            loading
                        </Typography>
                    </CardContent>
                </Card>
                :
                <Card sx={{ maxWidth: 200 }}>
                    <CardActionArea>
                        <Link to={`/auction/${props.id}`}>
                            <CardMedia
                                component="img"
                                height="200"
                                width="200"
                                image={props.image}
                                alt="auction"
                            />
                            <CardContent>
                                <p style={{margin: "5px auto"}}>
                                    {props.Moralis.Units.FromWei(props.highestBid)} ETH
                                </p>
                                <AuctionBar 
                                    closingPercentage={props.closingPercentage}
                                    progressPercentage={props.progressPercentage}
                                />
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>            
                }
            </div>
        </Tooltip>
    )
}

export default MiniViewAuction;
