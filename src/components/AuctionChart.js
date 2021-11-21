import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { ellipsisAddress } from '../utilities';

function AuctionChart(props) {
    const [ series, setSeries ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ colorCols, setColorCols ] = useState([]);

    useEffect(() => {
        if (props.blocks != {} && props.blocks != undefined) {
            var catArr = [];
            for(var i = 0; i < props.blocks.final - props.blocks.created; i++) {
                catArr.push(props.blocks.created + i);
            }
            if (catArr.length === props.blocks.final - props.blocks.created) {
                setCategories(catArr);
            }

            var seriesArr = [0,0,0,0,0,10,10,10,10]

            for (var i = seriesArr.length; i < catArr.length; i++) {
                seriesArr.push(seriesArr[i - 1]);
            }

            setSeries([
                {
                    name: "Some address", 
                    data: seriesArr
                }, 
                {
                    name: "Another address", 
                    data: seriesArr.map(e => e + 2)
                }
            ]);

            var colsArr = [];

            for (var i = 0; i < seriesArr.length; i++) {
                if (props.blocks.created + i <= props.blocks.closing) {
                    colsArr.push("white");
                }
                else {
                    colsArr.push("red");
                }
            }
            setColorCols(colsArr);
        }
    }, [props.blocks]);
    
    useEffect(() => {
        if (props.isInitialized === true &&
            props.Moralis !== undefined && 
            props.Moralis !== null && 
            props.auctionId >= 0 &&
            props.web3 !== undefined) {
            (async () => {
                // await getBidSeries();
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
        let currentBlock = await props.web3.eth.getBlockNumber();

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
                    grid: {
                        column: {
                            colors: colorCols
                        }
                    },
                    noData: {
                        text: "no bids yet",
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                          fontSize: '25px'
                        }
                    },
                    xaxis: {
                        type: "category",
                        tickAmount: 5,
                        categories: categories,
                        show: false,
                        axisTicks: {
                            show: false
                        }
                    },
                    stroke: {
                        curve: "stepline"
                    },
                    title: {
                        text: "bids",
                        align: "left"
                    },   
                    chart: {
                        toolbar: {
                            tools: {
                                pan: false
                            }
                        }
                    },      
                }}                
                series={series}
            />
        </div>
    )
}

export default AuctionChart;
