import React, { useState, useEffect } from 'react';
import { Input, ButtonGroup, Button, CircularProgress } from '@mui/material';
import Web3 from 'web3';
import NFT from './NFT';

function SearchNFTs(props) {
    const [ search, setSearch ] = useState("");
    const [ nftArray, setNftArray ] = useState([]);
    const [ nftTotal, setNftTotal ] = useState(0);
    const [ selected, setSelected ] = useState({});
    const [ cacheNft, setCacheNft ] = useState({});
    const [ loading, setLoading ] = useState(true);

    const retrieveAllNfts = async () => {
        let nfts = await retrieveNfts(0);
        if (nfts !== undefined) {
            setNftArray(nfts);
        }
    }

    const retrieveNfts = async offset => {
        const response = await props.Moralis.Web3API.account.getNFTs({
            chain: "eth", 
            address: "0x24422361687270c1ac2dd3f336e1bc130849617b",
            order: "name.ASC",
            offset: offset
        });        

        let nfts = response.result?.map(nft => {
            if (nft.metadata === null) {
                if (nft.name !== "") {
                    return ({
                        name: nft.name,
                        token_address: nft.token_address,
                        token_id: nft.token_id
                    });
                }
            } else {
                let parse = JSON.parse(nft.metadata);
                if (nft.name !== "" || parse.name !== "") {
                    return ({
                        name: parse.name ? parse.name : nft.name,
                        token_address: nft.token_address,
                        token_id: nft.token_id
                    });
                }
            }
        }).filter(element => element !== undefined && element !== null && element !== {});

        if (nftTotal === 0) {
            setNftTotal(response.total);
        }

        return nfts;
    }

    const retrieveSingleNft = async element => {
        setLoading(true);
        let meta = await props.retrieveNFT(element.token_address, element.token_id, "eth");
        if (meta !== null && meta !== undefined) {
            setSelected(meta);
        }
        setLoading(false);
    }

    useEffect(() => {   
        setLoading(true);     
    }, [])

    useEffect(() => {
        if (nftTotal > 500) {
            (async () => {
                const callQty = Math.floor(nftTotal);
                for (var i = 1; i < callQty; i++) {
                    let lateNfts = await retrieveNfts(500 * i);
                    if (lateNfts !== undefined && lateNfts.result !== undefined) {
                        let newNftArray = nftArray;
                        newNftArray.concat(lateNfts.result);
                        setNftArray(newNftArray);
                    }
                }
            })();
        } 
    }, [nftTotal])

    useEffect(() => {
        if (nftArray.length > 0) {
            setLoading(false);
        }
    }, [nftArray])

    useEffect(() => {
        if (Web3.utils.isAddress(props.wallet) && props.Moralis != undefined && nftArray.length === 0) {
            (async () => {
                await retrieveAllNfts();
            })();
        }
    }, [props.wallet, props.Moralis])

    return (
        <div style={{margin: "auto", width: "100%"}}>
            {loading === true ?
            <CircularProgress />
            :
            <div>
                {selected.name === undefined ?
                    <div style={{width: "100%", height: "300px",overflow: "scroll"}}>
                        <div>
                            <Input
                                style={{width: "100%"}}
                                variant="standard"
                                placeholder="Search..."
                                value={search}
                                type="text"
                                onChange={e => {
                                    setSearch(e.target.value)
                                }}
                            />
                            {nftArray.length === 0 ? 
                            <span></span>
                            :
                            <ButtonGroup
                                orientation="vertical"
                                variant="text"
                                style={{width: "100%"}}
                            >
                                {nftArray.filter(element => search === "" || element.name.toLowerCase().includes(search.toLowerCase())).map(element => {
                                    return (
                                        <Button
                                            key={element.token_address + "/" + element.token_id}   
                                            onClick={async () => {                     
                                                setCacheNft(element);
                                                await retrieveSingleNft(element);
                                            }}                         
                                        >
                                            {element.name}
                                        </Button>
                                    )                                                  
                                })}
                            </ButtonGroup>
                            }
                        </div>
                    </div>
                    :
                    <div style={{width: "100%"}}>
                        <NFT
                            data={selected}
                        />
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
                            <Button
                                onClick={() => {
                                    setSelected({});
                                }}
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={async () => {
                                    setLoading(true);
                                    setSelected({});
                                    await retrieveSingleNft(cacheNft);
                                }}
                            >
                                Reload                        
                            </Button>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
    )
}

export default SearchNFTs;
