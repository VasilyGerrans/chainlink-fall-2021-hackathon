import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';
import { ellipsisAddress, fixNFTURL } from './utilities';
import NFT from './NFT';
import './App.css';
import { Button, Tooltip } from '@material-ui/core';

function App() {
  const { Moralis } = useMoralis();
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");
  const [ nfts, setNfts ] = useState([]);

  const history = useHistory();

  const networkId = 42;

  const handleAccountsChanged = accounts => {
    if (accounts.length > 0) {
      setWallet(accounts[0]);
      (async () => {
        getNFTs();
      })();
    }
    else {
      setWallet('');
    }
  }

  const getNFTs = async () => {
    const options = {chain: 'eth', address: '0x13edbf878e3dbb91d36d15f9b9e061f72d20b603'}
    const NFTs = await Moralis.Web3API.account.getNFTs(options);

    console.log(NFTs);
    const arr = [];

    for(var i = 0; i < NFTs.result?.length; i++) {
      let response = await fetch(NFTs.result[i].token_uri);
      let json = await response.json();
      arr.push(json);
    }

    setNfts(arr);
  }

  useEffect(() => {
    (async () => {
      await initWeb3();
      await connect();
      await getNFTs();

      window.ethereum?.on('accountsChanged', handleAccountsChanged);
    })();
  }, []);

  /* useEffect(() => {
    console.log(nfts);
  }, [nfts]); */

  const initWeb3 = async () => {
    const provider = await detectEthereumProvider();
    const web3 = new Web3(provider);

    if (web3 != undefined) {
      await web3.eth.net.getId()
      .then(id => {
        if (Number(id) === networkId) {
          setValidNetwork(true);
        }
      });
    }

    window.ethereum?.on("networkChanged", id => {
      if (Number(id) === networkId) {
        setValidNetwork(true);
      }
      else {
        setValidNetwork(false);
      }
    });
  }

  const requestConnect = () => {
    window.ethereum?.request({ 
      method: 'eth_requestAccounts' 
    });
  }

  const connect = async () => {
    window.ethereum?.request({method: 'eth_accounts'})
    .then(handleAccountsChanged)
    .catch(err => {
      console.error(err);
    });
  }

  return (
    <div className="App">
      {validNetwork === false ?
      <div className="header">
        <div></div>
        <div>
          Please connect to the Kovan network through MetaMask
        </div>
        <div></div>
      </div>
      :
      Web3.utils.isAddress(wallet) ?
      <div className="header">
        <div>
          Kovan Testnet
        </div>
        <div>
        </div>
        <div>
          {ellipsisAddress(wallet)}
        </div>
      </div>
      :
      <div className="header">
        <div>
          Kovan Testnet
        </div>
        <div>          
        </div>
        <div>
          <button onClick={requestConnect}>
            Connect Wallet
          </button>
        </div>
      </div>
      }
      <div>
        <h1>
          Meltdown!
        </h1>
      </div>
      <Switch>
        <Route exact path="/">
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
              color="secondary" 
              size="large" 
              style={{fontFamily: "Inconsolata,monospace"}}
              onClick={() => {
                history.push("/create");
              }}
              disabled={false}
            >
              create an auction
            </Button>
          </div>          
        </Route>
        <Route path="/create">
          <div style={{textAlign: "left", width: "500px", margin: "50px auto", padding: "0px 20px", border: "1px solid black"}}>   
            {nfts.length > 0 ?
            <div>
              <div>
                <h2>select nft</h2>
              </div>
              <div style={{
                overflow: "scroll",
                height: "400px"
              }}>
                {nfts.length > 0 ?
                nfts.map(n => {
                  return (
                    <NFT
                      key={nfts.indexOf(n)}
                      name={n.name}
                      descritpion={n.descritpion}
                      src={fixNFTURL(n.image)}
                    />
                  )
                })
                :
                <span></span>
                }
              </div>
              <div>
                <h2>currency</h2>
              </div>
            </div>
            :
            <div style={{textAlign: "center"}}>
              <h2>No NFTs detected in your wallet</h2>
            </div>
            }
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
