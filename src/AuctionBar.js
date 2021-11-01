import React from 'react';

function AuctionBar(props) {
    return (
        <div style={{position: "relative"}}>
            <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                <div style={{backgroundColor: "blue", height: "5px", width: `${100 - props.closingPercentage}%`}}>                                
                </div>
                <div style={{backgroundColor: "red", height: "5px", width: `${props.closingPercentage}%`}}>
                </div>
            </div>
            <div style={{width: "100%", position: 'relative', left: "-4px"}}>
                <div style={{position: "absolute", top: "-15px", left: `${props.progressPercentage}%`}}>
                    |
                </div>
            </div>
        </div>
    )
}

export default AuctionBar;
