import React from 'react';
import { Button } from '@mui/material';
import MiniViewAuction from './MiniViewAuction';

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
                <h1 style={{textAlign: "left"}}>Live auctions</h1>
                <div style={{textAlign: "left"}}>
                    <MiniViewAuction 
                        image={"https://lh3.googleusercontent.com/Fxazoi72wuKiNJ5qdeHOwVvnjlFAhUXRFWPoli4655grNCBIRC6zZa_ovROs8F6f5FywTjXJEIg8zSgusxoUhvM4TtHuO7ikub9n=w600"}
                        closingPercentage={10}
                        progressPercentage={87}
                    />
                    <MiniViewAuction 
                        image={"https://lh3.googleusercontent.com/HZZZwVcJn58z8AnLvc0HrVFkVDFLy--zzE18g5Qvuh_gRN4pJ9DMOayu_sNzY3ltm0r5SgkkNviu655bKKE9wkiIO2ibhe_VJKfnrko=w600"}
                        closingPercentage={50}
                        progressPercentage={50}
                    />
                </div>
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
                        fontSize: "30px", 
                        margin: "30px"
                    }}
                >
                    create an auction
                </Button>
            </div>
        </div>
    )
}

export default Home;
