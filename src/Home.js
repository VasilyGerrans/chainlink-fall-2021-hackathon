import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MiniViewAuction from './components/MiniViewAuction';
import FeaturedAuction from './components/FeaturedAuction';
import {fixNFTURL} from './utilities'

const LazyMiniAuction = React.lazy(() => import('./components/MiniViewAuction'));

const DisplayMiniAuction = props => (
    <Suspense fallback={<MiniViewAuction id="" image="" />}>
        <LazyMiniAuction {...props} />
    </Suspense>
)

function Home(props) {
    const [ loadedAuctions, setLoadedAuctions ] = useState([]);
    const [ currentBlock, setCurrentBlock ] = useState(0);

    const getDisplayAuctions = async () => {
        let data = await props.Moralis.Cloud.run("getLiveAuctions")
        console.log(data)
        setLoadedAuctions(data);
    }

    useEffect(() => {
        if (props.isInitialized === true && loadedAuctions.length === 0 && props.web3 !== undefined) {
            (async () => {
                await getDisplayAuctions();
                const currentBlock = await props.web3.eth.getBlockNumber();
                setCurrentBlock(currentBlock);
            })();
        }
    }, [props.isInitialized, props.web3]);

    return (
        <div>
            <div>
                <h1 className="heading">
                    Featured Auction
                </h1>
            </div>
            <div style={{display: "inline-block"}}>
                <FeaturedAuction
                    data={props.featuredNft}
                    Moralis={props.Moralis}
                    isInitialized={props.isInitialized}
                    web3={props.web3}
                />
            </div>
            <div>
                <h1 className="heading" id='liveAuctions'>Live auctions</h1>
                <div style={{textAlign: "left"}}>
                    {loadedAuctions.map(auction => {
                        return (
                            <DisplayMiniAuction
                                key={auction.id}
                                id={auction.id}
                                Moralis={props.Moralis}
                                image={fixNFTURL(auction.meta.image)}
                                highestBid={auction.highestBid["1"]}
                                closingPercentage={100*(auction.finalBlock - auction.closingBlock)/(auction.finalBlock - auction.createdBlock)}
                                progressPercentage={100*(currentBlock - auction.createdBlock)/(auction.finalBlock - auction.createdBlock)}
                            />
                        )
                    })}                    
                </div>
            </div>            
        </div>
    )
}

export default Home;
