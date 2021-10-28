import React from 'react';
import { Button } from '@mui/material';

function Home(props) {
    return (
        <div>
            <div style={{"textAlign": "left"}}>
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
            </div>
            <div>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large" 
                    style={{fontFamily: "Inconsolata,monospace"}}
                    onClick={() => {
                        props.history.push("/create");
                    }}
                    disabled={false}
                    style={{
                        fontSize: "30px"
                    }}
                >
                    create an auction
                </Button>
            </div>
        </div>
    )
}

export default Home;
