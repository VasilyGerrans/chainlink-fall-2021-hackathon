import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardActionArea, CircularProgress } from '@mui/material';
import AuctionBar from './AuctionBar';

// only displays images, even for audio NFTs
// audio will be accessed in full pages

function MiniViewAuction(props) {
    return (
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
                            <h4 style={{margin: "5px auto"}}>
                                Current: 0 WETH
                            </h4>
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
    )
}

export default MiniViewAuction;
