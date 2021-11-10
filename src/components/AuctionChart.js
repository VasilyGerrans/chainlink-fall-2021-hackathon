import React from 'react';
import Chart from "react-apexcharts";
import { ellipsisAddress } from '../utilities';

function AuctionChart() {
    return (        
        <div>
            <Chart
                type="line"
                options={{
                    xaxis: {
                        categories: [100000000, 100000001, 100000003, 100000004, 100000005, 100000006],
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
                series={[
                    {
                        name: ellipsisAddress("0xffA1c53b18d864A6340adA628BdFF6651fa4E097", 4),
                        data: [0.04, 0.05, 0.06, 0.061, 0.0611]
                    },
                    {
                        name: ellipsisAddress("0x63c84D89660588beA3918f626537D7989897caeF", 4),
                        data: [0, 0, 0.0605, 0.0605, 0.07],
                    },
                    {
                        name: ellipsisAddress("0x187e11BFcD3998150487444dA5B736F1DF133154", 4),
                        data: [0, 0.04, 0.05, 0.07, 0.07]
                    }
                ]}
            />
        </div>
    )
}

export default AuctionChart;
