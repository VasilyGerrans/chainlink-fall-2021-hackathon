import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import NFT from './components/NFT';
import { ellipsisAddress } from './utilities';
import AuctionChart from './components/AuctionChart';
import humanizeDuration from 'humanize-duration';
import { Grid } from '@mui/material';
import { Popup } from 'reactjs-popup';


function ViewAuction(props) {
    const { id } = useParams();
    const [ loadedNft, setLoadedNft ] = useState({});
    const [ badUrl, setBadUrl ] = useState(false);
    const [ highestBid, setHighestBid ] = useState(0.1);
    const [ current, setCurrent ] = useState(5000);
    const [ bidding, setBidding ] = useState(10000);
    const [ closing, setClosing ] = useState(2000);

    const findAuction = async () => {
        const query = new props.Moralis.Query("auctions");
        const result = await query.equalTo("objectId", id).first();
        if (result === undefined) {
            setBadUrl(true);
        }
        else {
            let meta = await props.retrieveNFT(result.attributes.token_address, result.attributes.token_id, "eth");
            setLoadedNft(meta);
        }
    }

    useEffect(() => {
        console.log(Math.floor((current * 100)/(bidding + closing)));
        if (props.isInitialized === true) {
            (async () => {
                await findAuction();
            })();
        }
    }, [props.isInitialized]);

    return (
        <div>
            {badUrl === true ? 
            <div>
                <h1>404 – auction not found</h1>
                <Link to="/">
                    <Button
                        variant="outlined" 
                        color="primary" 
                        size="large" 
                        style={{fontSize: "30px"}}
                    >
                        home
                    </Button>
                </Link>
            </div>
            :
            <div>
                <Grid container spacing={2}>
                    <Grid container item>
                        <Grid item md={4}>
                            <NFT
                                data={loadedNft}
                            />
                        </Grid>
                        <Grid item md={8}>
                            <AuctionChart 
                                Moralis={props.Moralis}
                                auctionId={1}
                                isInitialized={props.isInitialized}
                            />
                        </Grid>
                    </Grid>

                    <Grid item md={12}>
                        <div className="nes-container bidButtons">
                            <Popup
                                trigger={<button className="bid-button">Add to bid</button>}
                                modal
                                className="popup-content"
                            >
                                {close => (
                                <div className="modal">
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <div className="header">Confirm bid</div>
                                        <button className="close" onClick={close}>
                                        &times;
                                        </button>
                                    </div>
                                    <div className="content">
                                        <p>Your curent bid is: __ ETH</p>
                                        <p>The highest bid is __ ETH (you) </p>
                                        <input className="bid-input" placeholder="1"></input> ETH
                                    </div>
                                    <div className="actions">
                                    <button className="bid-button"> Update bid </button>
                                    <div className="divider"/>
                                    </div>
                                </div>
                                )}
                            </Popup>
                            <div className="divider"/>
                            <button className="bid-button">Withdraw</button>
                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className="nes-container">
                            <div>
                                <h2>Auction Information</h2>
                                <div>
                                    Current block: {current}<br/>
                                    Remaining blocks: {bidding + closing - current}<br/>
                                    Approx time remaining: {humanizeDuration((bidding + closing - current)*13000)}
                                </div>                        
                            </div>
                            <div>
                                <h2>Top bidders</h2>
                                <ol>
                                    <li>
                                        <b>{ellipsisAddress("0x187e11BFcD3998150487444dA5B736F1DF133154", 4)}, 4 ETH, block 4000</b>
                                    </li>
                                    <li>
                                        {ellipsisAddress("0x187e11BFcD3998150487444dA5B736F1DF133154", 4)}, 3 ETH, block 3000
                                    </li>
                                    <li>
                                        {ellipsisAddress("0xffA1c53b18d864A6340adA628BdFF6651fa4E097", 4)}, 2 ETH, block 200
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div>
                    <div>
                    </div>
                    <br />
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    </div>
                    {/* <div style={{margin: "30px auto"}}>
                        <AuctionBar
                            closingPercentage={Math.floor((closing * 100)/(bidding + closing))}
                            progressPercentage={Math.floor((current * 100)/(bidding + closing))}
                        />
                    </div> */}
                    {/* <Tooltip 
                        title={`${(bidding + closing) - current} blocks remaining`} 
                        placement="top"
                    > */}
                    {/* </Tooltip> */}
                </div>
            </div>
            }
        </div>
    )
}

export default ViewAuction;
