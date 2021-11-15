import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { ellipsisAddress } from '../utilities';
import Web3 from 'web3';

function AuctionChart(props) {
    const [ series, setSeries ] = useState([]);
    const [ categories, setCategories ] = useState([]);

    useEffect(() => {
        if (props.isInitialized === true &&
            props.Moralis !== undefined && 
            props.Moralis !== null && 
            props.auctionId >= 0) {
            (async () => {
                await getBidSeries();
            })();
        }
    }, [props.Moralis, props.auctionId, props.isInitialized]);

    const getBidSeries = async () => {
        const query = new props.Moralis.Query("BidIncreased");
        query.equalTo("auctionId", props.auctionId.toString());
        const result = await query.find();

        let catArray = [];
        for (var i = 0; i < result.length; i++) {
            catArray.push(result[i].attributes.block_number);
        }

        // can be moved further up the hierarchy later
        var web3 = new Web3('https://kovan.infura.io/v3/416304afa6a24e61934cad318b64884c');
        let currentBlock = await web3.eth.getBlockNumber();

        if (catArray.includes(currentBlock) === false) {
            catArray.push(currentBlock);
        }
        
        setCategories(catArray);

        // fetch unique bidders
        let bidders = [];
        for (let element of result) {
            let bidder = element.attributes.bidder;
            if (bidders.indexOf(bidder) === -1) {
                bidders.push(bidder);
            }
        }

        // pretty sure this should always give us the correct 
        // top five bidders
        if (bidders.length > 5) {
            // find top 5
            let topBidders = [];
            for (var i = 0; i < bidders.length; i++) {
                let bidderTotal = 0;
                for (var j = 0; j < result.length; j++) {
                    if (result[j].attributes.bidder === bidders[i]) {
                        bidderTotal += Number(result[j].attributes.amount);
                    }
                }
                topBidders.push({bidder: bidders[i], total: bidderTotal});
            }

            topBidders.sort((a, b) => b.total - a.total);
            topBidders.slice(0, 5);
            bidders = topBidders.map(bidderObj => bidderObj.bidder);
        }
        
        let seriesArr = bidders.map(bidder => {
            let data = [];
            for (var i = 0; i < catArray.length; i++) {
                if (i === 0) {
                    if (result[i].attributes.bidder === bidder) {
                        data.push(Number(result[i].attributes.amount));
                    } else {
                        data.push(0);
                    }
                } else if (i === catArray.length - 1) {
                    data.push(data[i - 1]);
                } else {
                    if (result[i].attributes.bidder === bidder) {
                        data.push(Number(result[i].attributes.amount) + data[i-1]);
                    } else {
                        data.push(data[i - 1]);
                    }
                }
            }
            return {
                name: ellipsisAddress(bidder, 4),
                data
            }
        });

        setSeries(seriesArr);
    }

    return (        
        <div>
            <Chart
                type="line"
                options={{
                    xaxis: {
                        categories: categories,
                        show: true
                    },
                    stroke: {
                        curve: "stepline"
                    },
                    title: {
                        text: "Bids",
                        align: "left"
                    },   
                    chart: {
                        toolbar: {
                            tools: {
                                pan: false
                            }
                        }
                    }                 
                }}                
                series={series}
            />
        </div>
    )
}

export default AuctionChart;
