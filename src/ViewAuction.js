import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NFT from './components/NFT';

function ViewAuction(props) {
    const { id } = useParams();
    const [ loadedNft, setLoadedNft ] = useState({});
    const [ badUrl, setBadUrl ] = useState(false);

    const findAuction = async () => {
        const query = new props.Moralis.Query("auctions");
        const result = await query.equalTo("objectId", id).first();
        if (result === undefined) {
            setBadUrl(true);
        }
        else {
            let meta = await props.retrieveNFT(result.attributes.token_address, result.attributes.token_id, "eth");
            console.log("META", meta);
            setLoadedNft(meta);
        }
    }

    useEffect(() => {
        if (props.isInitialized === true) {
            (async () => {
                await findAuction();
            })();
        }
    }, [props.isInitialized]);

    return (
        <div>
            {badUrl === true ? 
            <h1>404</h1>
            :
            <div>
                <NFT
                    data={loadedNft}
                />
            </div>
            }
        </div>
    )
}

export default ViewAuction;
