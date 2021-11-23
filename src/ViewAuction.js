import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import NFT from './components/NFT';
import { ellipsisAddress } from './utilities';
import AuctionChart from './components/AuctionChart';
import humanizeDuration from 'humanize-duration';
import { Grid } from '@mui/material';
import { Popup } from 'reactjs-popup';
import candleABI from './abi/Candle.json';

function ViewAuction(props) {
    const { id } = useParams();
    const [ loadedNft, setLoadedNft ] = useState({});
    const [ badUrl, setBadUrl ] = useState(false);
    const [ highestBid, setHighestBid ] = useState(0);
    const [ highestBidder, setHighestBidder ] = useState("");
    const [ myCurrentBid, setMyCurrentBid ] = useState(0);
    const [ blocks, setBlocks ] = useState({});
    const [ myBid, setMyBid ] = useState(0);
    const [ aid, setAuctionId ] = useState(0);
    const [ auctionStage, setAuctionStage ] = useState();
    const [ topBidders, setTopBidders ] = useState([]);
    const [ topAmounts, setTopAmounts ] = useState([]);
    const CONTRACT_ADDR = "0xaDbe2339225C83DAfE0621c26f413da6dA879EC1";

    const findAuction = async () => {
        console.log("CALLED");
        const query = new props.Moralis.Query("AuctionCreated");
        const result = await query.get(id).then(async (auction) => {
            console.log("CALLED 2", auction);
            setAuctionId(auction.get("auctionId"));
            const currentBlock = await props.web3.eth.getBlockNumber();
            const closingBlock = Number(auction.attributes.closingBlock);
            const finalBlock = Number(auction.attributes.finalBlock);
            if (currentBlock < closingBlock) {
                // we are in regular bidding phase
                setAuctionStage(0);
            } else if (closingBlock <= currentBlock && currentBlock <= finalBlock){
                //we are in closing bidding phase
                setAuctionStage(1);
            } else {
                // auction has ended
                setAuctionStage(2);
            }
            setBlocks({
                current: currentBlock,
                created: Number(auction.attributes.block_number),
                closing: Number(auction.attributes.closingBlock),
                final: Number(auction.attributes.finalBlock)
            });
            const options = {
                contractAddress: CONTRACT_ADDR,
                functionName: "getAuction",
                abi: candleABI,
                params: {
                    auctionId: auction.get("auctionId"),
                }
            };
            const receipt = await props.Moralis.executeFunction(options);
            let meta = await props.retrieveNFT(receipt["0"], receipt["1"], "kovan");
            console.log(meta);
            setLoadedNft(meta);
        }, (error) => {
            setBadUrl(true);
        });

    }

    const withdraw = async() => {
        const options = {
            contractAddress: CONTRACT_ADDR,
            functionName: "withdraw",
            abi: candleABI,
            params: {
                auctionId: aid,
            }
        };
        const receipt = await props.Moralis.executeFunction(options);
    }

    const updateHighest = async() => {
        console.log("updated Highest");
        if(aid !== 0 && props.wallet !== undefined) {
            if (highestBid === 0) {
                (async() => {
                    const options = {
                        contractAddress: CONTRACT_ADDR,
                        functionName: "getHighestBid",
                        abi: candleABI,
                        params: {
                            auctionId: aid,
                        },
                    };
                    const result = await props.Moralis.executeFunction(options);
                    console.log("currentHighestBid: ", result);
                    if (result["0"] !== "0x0000000000000000000000000000000000000000"){
                        setHighestBid(result["1"]);
                    }
                    setHighestBidder(result["0"]);
                })();
            }
            if (myCurrentBid === 0){
                (async() => {
                    const options = {
                        contractAddress: CONTRACT_ADDR,
                        functionName: "currentCumulativeBid",
                        abi: candleABI,
                        params: {
                            auctionId: aid,
                            bidder: props.wallet,
                        },
                    };
                    const result = await props.Moralis.executeFunction(options);
                    console.log("myHighestBid: ", result);
                    setMyCurrentBid(result);
                })();
            }
        }
    }

    const updateBid = async() => {
        const options = {
            contractAddress: CONTRACT_ADDR,
            functionName: "addToBid",
            abi: candleABI,
            params: {
                auctionId: aid,
            },
            msgValue: props.Moralis.Units.ETH(myBid),
        };
        console.log(options);
        const receipt = await props.Moralis.executeFunction(options);
    }

    useEffect(() => {
        if (props.isInitialized === true && props.web3 !== undefined) {
            (async () => {
                await findAuction();
            })();
        }
    }, [props.isInitialized, props.web3]);

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
                                auctionId={aid}
                                web3={props.web3}
                                blocks={blocks}
                                setTopBidders={setTopBidders}
                                setTopAmounts={setTopAmounts}
                            />
                        </Grid>
                    </Grid>

                    <Grid item md={12}>
                        <div className="nes-container bidButtons">
                            <Popup
                                trigger={<button disabled={auctionStage===2} className="bid-button">Add to bid</button>}
                                modal
                                className="popup-content"
                                onOpen={updateHighest}
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
                                        <p>Your curent bid is: {props.Moralis.Units.FromWei(myCurrentBid)} ETH</p>
                                        <p>The highest bid is {props.Moralis.Units.FromWei(highestBid)} ETH {
                                        highestBidder==="0x0000000000000000000000000000000000000000"
                                        ? "": "("+highestBidder+")"} </p>
                                        <input className="bid-input"
                                            placeholder="0.1"
                                            value={myBid}
                                            onChange={event => {
                                                if (event.target.value >= 0) {
                                                    setMyBid(event.target.value);
                                                } 
                                            }}>
                                        </input> ETH
                                    </div>
                                    <div className="actions">
                                    <button className="bid-button" onClick={updateBid}> Update bid </button>
                                    <div className="divider"/>
                                    </div>
                                </div>
                                )}
                            </Popup>
                            <div className="divider"/>
                            <button onClick={ withdraw } disabled={auctionStage!==2} className="bid-button">Withdraw</button>
                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className="nes-container">
                            <div>
                                <h2>Auction Information</h2>
                                {auctionStage===0 && <b style={{color: "red"}}>Auction Live</b>}
                                {auctionStage===1 && <b style={{color: "orange"}}>Auction Finalising</b>}
                                {auctionStage===2 && <b style={{color: "green"}}>Auction Finished</b>}
                                <div>
                                    Current block: {blocks.current}<br/>
                                    Remaining blocks: {blocks.final - blocks.current}<br/>
                                    Approx time remaining: {humanizeDuration((blocks.final - blocks.current)*13000)}
                                </div>                        
                            </div>
                            <div>
                                <h2>Top bidders</h2>
                                <ol>
                                    {topBidders.map((e, i) => {
                                        return (
                                            <li>
                                                {e}: {props.Moralis.Units.FromWei(topAmounts[i])} ETH
                                            </li>
                                        )
                                    })}
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
