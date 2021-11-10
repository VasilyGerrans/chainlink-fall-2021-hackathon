import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToggleButtonGroup, ToggleButton, Button, Tooltip, Input, Box, Slider, CircularProgress, TextField } from '@mui/material';
import { ButtonGroup } from "@mui/material"
import Web3 from 'web3';
import NFT from './components/NFT';
import SearchNFTs from './components/SearchNFTs';

function CreateAuction(props) {
    const timeOptions = Object.freeze(["hours", "days", "weeks"]);
    
    const [ alignment, setAlignment ] = useState("eth");
    const [ biddingTime, setBiddingTime ] = useState(timeOptions[0]); 
    const [ closingPerc, setClosingPerc ] = useState(80);
    const [ auctionTime, setAuctionTime ] = useState("");
    const [ startingBid, setStartingBid ] = useState("");
    const [ search, setSearch ] = useState("");
    const [ token, setToken ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ errMsg, setErrMsg] = useState("");
    const [ error, setError] = useState(false);
    const [ tknMsg, setTknMsg] = useState("");
    const [ tkErr, setTkErr] = useState(false);
    const [ loadedNft, setLoadedNft ] = useState({});
    
    const resetCreateAuction = () => {
        setAlignment("eth");
        setBiddingTime(timeOptions[0]);
        setClosingPerc(80);
        setAuctionTime("");
        setStartingBid("");
    }
    
    const resetManualSearch = () => {
        setSearch("");
        setToken("");
        setError(false);
        setErrMsg("");
        setTkErr(false);
        setTknMsg("");
    }

    const resetErrors = () => {
        setError(false);
        setErrMsg("");
        setTkErr(false);
        setTknMsg("");
    }

    const resetNft = () => {
        console.log("CAlled");
        setLoadedNft({});
    }

    useEffect(() => {
        console.log('reset to', loadedNft);
    }, [loadedNft]);
    
    const blocksFromTime = () => {
        let timeMultiplier = (biddingTime === timeOptions[0] ? 1 : biddingTime === timeOptions[1] ? 24 : 24 * 7);
        return Math.ceil(Number(auctionTime) * 60 * 60 * timeMultiplier / 13);
    }    

    const sendNFTApprove = () => {

    }

    const sendCreateAuction = () => {
        console.log(auctionTime, startingBid, token);
    }

    return (
        <div style={{textAlign: "left", width: "500px", margin: "50px auto", padding: "0px 20px", border: "1px solid black"}}>   
            <div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div></div>
                    <Link onClick={resetCreateAuction} to="/">
                        <h2 style={{cursor: "pointer"}}>X</h2>
                    </Link>
                </div>
                <div className="convenience-container" style={{textAlign: "center", display: "flex", alignItems: "center"}}>
                    <SearchNFTs 
                        wallet={props.wallet}
                        Moralis={props.Moralis}
                        retrieveNFT={props.retrieveNFT}
                    />
                    {/* 
                    {loading === true ? 
                    <div style={{margin: "auto"}}>
                        <CircularProgress />
                    </div>
                    :
                    loadedNft.name === undefined ?
                    <div>
                        <TextField
                            error={error}
                            helperText={errMsg}
                            variant="standard"
                            placeholder="NFT contract address" 
                            style={{
                                width: "470px",
                                marginBottom: "30px"
                            }}
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                            }}
                        />
                        <TextField
                            error={tkErr}
                            helperText={tknMsg}
                            type="number"
                            variant="standard"
                            placeholder="NFT token id" 
                            style={{
                                width: "470px",
                                marginBottom: "30px"
                            }}
                            value={token}
                            onChange={(event) => {
                                setToken(event.target.value);
                            }}
                        />
                        <Button onClick={() => {
                            resetManualSearch();
                        }}>
                            Clear
                        </Button>
                        <Button onClick={async () => {
                            resetErrors();
                            if (!Web3.utils.isAddress(search) || !Web3.utils.isAddress(props.wallet)) {
                                setError(true);
                                setErrMsg("Please, enter a valid NFT contract address.");
                            } else if (typeof Number(token) !== "number" || token.length === 0) {
                                setTkErr(true);
                                setTknMsg("Please write a valid number for token id.");
                            }
                            else {
                                try {
                                    setLoading(true);
                                    let meta = await props.retrieveNFT(search, token, "eth");
                                    console.log(meta);  
                                    if (meta === null) {
                                        setTkErr(true);
                                        setTknMsg("No corresponding NFT found. You may have entered an invalid address or id, or you are referring to a lazy minted NFT that is not on the blockchain yet.");
                                    }
                                    else {
                                        setLoadedNft(meta);
                                    }
                                    setLoading(false);
                                } catch (err) {
                                    setTkErr(true);
                                    setTknMsg("No corresponding NFT found. You may have entered an invalid address or id, or you are referring to a lazy minted NFT that is not on the blockchain yet.");
                                    setLoading(false);
                                }
                            }
                        }}>
                            Search
                        </Button>
                    </div>
                    : 
                    <div style={{margin: "auto"}}>
                        <NFT 
                            style={{justifyContent: "left"}}
                            data={loadedNft}
                        />
                        <Button onClick={() => {
                            resetManualSearch();
                            resetNft();
                        }}>
                            Clear
                        </Button>
                    </div>
                    } */}
                </div>
                <br />            
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
                    </Tooltip><b>ETH</b>
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
                <ButtonGroup size="medium" aria-label="small button group">
                <Button 
                        onClick={sendNFTApprove}
                    disabled={!(startingBid !== "" && Number(startingBid) > 0 &&
                        auctionTime !== "" && Number(auctionTime) > 0 && 
                        loadedNft.token_address != undefined)}
                        >
                        approve nft
                    </Button>
                    <Button 
                        onClick={sendCreateAuction}
                        disabled={!(startingBid !== "" && Number(startingBid) > 0 &&
                            auctionTime !== "" && Number(auctionTime) > 0 && 
                            loadedNft.token_address != undefined)}
                        >
                    create auction
                </Button>
                </ButtonGroup>
                </div>
            </div>        
        </div>
    )
}

export default CreateAuction;
