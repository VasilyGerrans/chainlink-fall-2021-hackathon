import React, { useEffect, useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Button, Tooltip, Input, Box, Slider, TextField } from '@mui/material';
import { fixNFTURL } from './utilities';
import Web3 from 'web3';
import NFT from './NFT';

function CreateAuction(props) {
    useEffect(() => {
        if (props.nfts.length > 0) {
            setSelectedNft(props.nfts[0]);
        }
    }, [props.nfts]);

    const timeOptions = Object.freeze(["hours", "days", "weeks"]);
    const displayOptions = Object.freeze(["highlight", "search", "selected"]);
    
    const [ alignment, setAlignment ] = useState("eth");
    const [ biddingTime, setBiddingTime ] = useState(timeOptions[0]); 
    const [ closingPerc, setClosingPerc ] = useState(80);
    const [ auctionTime, setAuctionTime ] = useState("");
    const [ startingBid, setStartingBid ] = useState("");
    const [ search, setSearch ] = useState("");
    const [ tokenId, setTokenId ] = useState("");
    const [ selectedNft, setSelectedNft ] = useState({});
    const [ display, setDisplay ] = useState(displayOptions[0]);

    const resetCreateAuction = () => {
        setAlignment("eth");
        setBiddingTime(timeOptions[0]);
        setClosingPerc(80);
        setAuctionTime("");
        setStartingBid("");
    }

    const blocksFromTime = () => {
        let timeMultiplier = (biddingTime === timeOptions[0] ? 1 : biddingTime === timeOptions[1] ? 24 : 24 * 7);
        return Math.ceil(Number(auctionTime) * 60 * 60 * timeMultiplier / 13);
    }

    return (
        <div style={{textAlign: "left", width: "500px", margin: "50px auto", padding: "0px 20px", border: "1px solid black"}}>   
        {props.nfts.length > 0 ?
        <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <h2>select nft</h2>
            <h2 style={{cursor: "pointer"}} onClick={() => {
                props.history.push("/");
                resetCreateAuction();
            }}>X</h2>
            </div>
            {display === displayOptions[1] ?
            <div style={{textAlign: "center", height: "400px", display: "flex", alignItems: "center"}}>
                <div>
                    <Input 
                        placeholder="enter your NFT contract address here" 
                        style={{
                            width: "470px",
                            marginBottom: "30px"
                        }}
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                    />
                    <br/>
                    <Input 
                        placeholder="enter your token id here" 
                        style={{
                            width: "470px",
                            marginBottom: "30px"
                        }}
                        value={tokenId}
                        onChange={(event) => {
                            setTokenId(event.target.value);
                        }}
                    />
                    <Button 
                        color="secondary"
                        onClick={() => {
                            if (props.nfts.length > 0) {
                                setSelectedNft(props.nfts[0]);
                            }
                            setDisplay(displayOptions[0]);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            console.log(search);
                            if (Web3.utils.isAddress(search)) {
                                try {
                                    const options = {chain: "eth", address: search, token_id: tokenId}
                                    const meta = await props.Moralis.Web3API.token.getTokenIdMetadata(options);
                                    console.log(meta);
                                    const result = await props.pushNftResult(meta);
                                    setSelectedNft(result);
                                    setDisplay(displayOptions[0]); // need to find a way to fix the CORS
                                } catch(err) {

                                }
                            }
                        }}
                    >
                        Search
                    </Button>
                </div>
            </div>
            :
            display === displayOptions[2] ?
            <div>
                SELECTED
            </div>
            :
            props.nfts.length > 0 ?
            <div style={{
                overflow: "scroll",
                height: "400px"
            }}>
                <ToggleButtonGroup
                    orientation="vertical"
                    exclusive
                    value={selectedNft}
                    style={{width: "100%"}}
                    onChange={(event, newValue) => {
                        if (newValue !== null) {
                            console.log(newValue);
                            let nft = props.nfts?.find(n => n.id === newValue);
                            if (typeof nft === "object") {
                                setSelectedNft(nft);
                            }
                            else {
                                setSelectedNft("");
                            }
                        }
                    }}
                >
                    {props.nfts.map(n => {
                        return (
                        <ToggleButton key={n.id} value={n.id} aria-label="list">
                            <NFT
                                name={n.name}
                                descritpion={n.descritpion}
                                src={fixNFTURL(n.image)}
                            />
                        </ToggleButton>
                        )
                    })}
                </ToggleButtonGroup>
                {props.nftQty > 10 ?
                <div style={{justifyContent: "left"}}>
                    <Button 
                        style={{width: "500px"}}
                        onClick={() => {
                            setSelectedNft({});
                            setDisplay(displayOptions[1]);
                        }}    
                    >                      
                        <h4 style={{margin: "auto"}}>Search {props.nftQty - props.nfts.length} more nfts...</h4>
                    </Button>
                </div>
                :
                <span></span>
                }
            </div>
            :
            <div></div>
            }
            <br/>
            {selectedNft === {} ?
            <span></span>
            :
            <div>
                <div className="convenience-container">
                    <h2>
                        {selectedNft.name}
                    </h2>
                </div>
                <div className="convenience-container">
                    {selectedNft.description}
                </div>
            </div>
            }
            <div className="convenience-container">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>
                <Tooltip title="Determines the starting amount bidders will have to bid." placement="left">
                    <Input
                        type="number"
                        placeholder="starting bid"
                        value={startingBid} 
                        onChange={event => {
                            if (event.target.value > 0) {
                                setStartingBid(event.target.value);
                            }
                            else if (event.target.value === "0" || event.target.value === "") {
                                setStartingBid("");
                            }
                        }}
                    />
                </Tooltip>
                </div>
                <div>
                <ToggleButtonGroup
                    exclusive
                    value={alignment}
                    onChange={(event, newAlignment) => {
                        if (newAlignment !== null) {
                            setAlignment(newAlignment);
                        }
                    }}
                >
                    <ToggleButton size="medium" value="eth">WETH</ToggleButton>
                    <ToggleButton size="medium" value="usdc">USDC</ToggleButton>
                </ToggleButtonGroup>
                </div>
            </div>
            </div>
            <div className="convenience-container">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>
                <Tooltip title="Determines how long the auction will last." placement="left">
                    <Input
                    type="number"
                    placeholder="auction time"
                    value={auctionTime}                      
                    onChange={event => {
                        if (event.target.value > 0) {
                        setAuctionTime(event.target.value);
                        }
                        else if (event.target.value === "0" || event.target.value === "") {
                        setAuctionTime("");
                        }
                    }}
                    />
                </Tooltip>
                </div>
                <div>
                <ToggleButtonGroup
                    exclusive
                    value={biddingTime}
                    onChange={(event, newAlignment) => {
                        if (newAlignment !== null) {
                            setBiddingTime(newAlignment);
                        }
                    }}
                >
                    <ToggleButton size="medium" value={timeOptions[0]}>{timeOptions[0]}</ToggleButton>
                    <ToggleButton size="medium" value={timeOptions[1]}>{timeOptions[1]}</ToggleButton>
                    <ToggleButton size="medium" value={timeOptions[2]}>{timeOptions[2]}</ToggleButton>
                </ToggleButtonGroup>
                </div>                  
            </div>
            <div>      
            </div>
            </div>              
            {typeof closingPerc === "number" ?
            <div className="convenience-container" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Tooltip title="Determines the percent of the auction during which it can (randomly) end." placement="left">
                <div>
                    closing time
                </div>
                </Tooltip>
                <Box sx={{width: 200}}>
                <Slider
                    value={closingPerc}
                    onChange={(event, newValue) => {
                    setClosingPerc(Math.max(20, Math.min(80, newValue)));
                    }}
                    track="inverted"
                    min={0}
                    step={1}
                    max={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => {
                    return `${100-value}%`;
                    }}
                />
                </Box>
            </div>
            :
            <span></span>
            }
            {auctionTime === "" || Number(auctionTime) === 0 ?
            <div></div>
            :
            <div className="convenience-container" style={{display: "flex", justifyContent: "space-between", alignItems: "center", color: "grey"}} >
            <div>        
                <div>
                duration: 
                </div>
                <div>
                {blocksFromTime()} blocks
                </div>
            </div>
            <div>
                <div>
                bidding: 
                </div>
                <div>
                {Math.round(blocksFromTime() * (closingPerc / 100))} blocks
                </div>
            </div>
            <div>
                <div>
                closing: 
                </div>
                <div>
                {Math.round(blocksFromTime() * (1 - closingPerc / 100))} blocks
                </div>
            </div>
            </div>
            }
            <div style={{margin: "20px", textAlign: "center"}}>
            <Button 
                size="large" 
                disabled={!(startingBid !== "" && Number(startingBid) > 0 &&
                auctionTime !== "" && Number(auctionTime) > 0)}
                style={{fontWeight: "bold", fontSize: "30px"}}>
                create auction
            </Button>
            </div>
        </div>
        :
        <div style={{textAlign: "center"}}>
            <h2>No NFTs detected in your wallet</h2>
        </div>
        }
        </div>
    )
}

export default CreateAuction;
