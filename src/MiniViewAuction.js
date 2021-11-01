import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import AuctionBar from './AuctionBar';

function MiniViewAuction(props) {
    return (
        <div className="miniViewAuction">
            <Card sx={{ maxWidth: 200 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="200"
                        width="200"
                        image={props.image}
                        alt="NFT"
                    />
                    <CardContent>
                        <Typography>
                            <h4 style={{margin: "0"}}>
                                Current: 0.1 WETH
                            </h4>
                            <AuctionBar 
                                closingPercentage={props.closingPercentage}
                                progressPercentage={props.progressPercentage}
                            />
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}

export default MiniViewAuction;
