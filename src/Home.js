import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MiniViewAuction from './components/MiniViewAuction';

const LazyMiniAuction = React.lazy(() => import('./components/MiniViewAuction'));

const DisplayMiniAuction = props => (
    <Suspense fallback={<MiniViewAuction id="" image="" />}>
        <LazyMiniAuction {...props} />
    </Suspense>
)

function Home(props) {
    const [ loadedAuctions, setLoadedAuctions ] = useState([]);

    const getDisplayAuctions = async () => {
        const query = new props.Moralis.Query("auctions");
        const result = await query.find();
        setLoadedAuctions(result);
    }

    useEffect(() => {
        if (props.isInitialized === true && loadedAuctions.length === 0) {
            (async () => {
                await getDisplayAuctions();
            })();
        }
    }, [props.isInitialized]);

    return (
        <div>
           {/*  <div style={{"textAlign": "left"}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis facilisis sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed id dolor ex. Etiam sed augue sit amet nisl semper elementum nec non mauris. Nulla varius eu urna quis pretium. Quisque ut elit non nibh laoreet viverra. Morbi laoreet sodales urna, vitae iaculis eros. Praesent nulla lorem, varius nec mattis ut, efficitur et nisi. 
            </div>
            <div>
                <h1 style={{textAlign: "right"}}>
                What are candle auctions?
                </h1>
            </div>
            <div style={{"textAlign": "left"}}>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis facilisis sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
                </p>
                <p>
                Morbi laoreet sodales urna, vitae iaculis eros. Praesent nulla lorem, varius nec mattis ut, efficitur et nisi. 
                </p>
            </div> */}
            <div>
                <Link to="/create">
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        size="large" 
                        style={{fontFamily: "Inconsolata,monospace"}}
                        disabled={false}
                        style={{
                            fontSize: "30px", 
                            margin: "30px"
                        }}
                    >
                        create an auction
                    </Button>
                </Link>
            </div>
            <div>
                <h1 style={{textAlign: "left"}}>Live auctions</h1>
                <div style={{textAlign: "left"}}>
                    {loadedAuctions.map(auction => {
                        return (
                            <DisplayMiniAuction
                                key={auction.id}
                                id={auction.id}
                                image={auction.attributes.src}
                                closingPercentage={auction.attributes.closing_percentage}
                                progressPercentage={Math.floor(Math.random() * 100)}
                            />
                        )
                    })}                    
                </div>
            </div>            
        </div>
    )
}

export default Home;
