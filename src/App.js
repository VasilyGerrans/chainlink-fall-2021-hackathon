import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ellipsisAddress, fixNFTURL } from './utilities';
import NFT from './NFT';
import './App.css';
import { Button, Input } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';

function App() {
  const timeOptions = ["hours", "days", "weeks"];

  const { Moralis } = useMoralis();
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");
  const [ nfts, setNfts ] = useState([]);
  const [ alignment, setAlignment ] = useState("eth");
  const [ biddingTime, setBiddingTime ] = useState(timeOptions[0]); 
  const [ closingTime, setClosingTime ] = useState(timeOptions[0]);

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

    const arr = [];

    for(var i = 0; i < NFTs.result?.length; i++) {
      let response = await fetch(NFTs.result[i].token_uri);
      let json = await response.json();
      arr.push(json);
    }

    if (arr.length > 0) {
      console.log("arr", arr);
      setNfts(arr);
    }
    else {
      setNfts([]);
    }
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
        <div style={{color: "red"}}>
          Please connect to the <b>Kovan</b> network through MetaMask
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
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h2>select nft</h2>
                <h2 style={{cursor: "pointer"}} onClick={() => {
                  history.push("/");
                }}>X</h2>
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
              <br/>
              <div className="convenience-container">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <Input
                      type="number"
                      placeholder="starting bid"
                    />
                  </div>
                  <div>
                    <ToggleButtonGroup
                      exclusive
                      value={alignment}
                      onChange={(event, newAlignment) => {
                        if (newAlignment !== null) {
                          setAlignment(newAlignment);
                        }
                      }}
                    >
                      <ToggleButton size="medium" value="eth">WETH</ToggleButton>
                      <ToggleButton size="medium" value="usdc">USDC</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              </div>
              <div className="convenience-container">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <Input
                      type="number"
                      placeholder="bidding time"
                    />
                  </div>
                  <div>
                    <ToggleButtonGroup
                      exclusive
                      value={biddingTime}
                      onChange={(event, newAlignment) => {
                        if (newAlignment !== null) {
                          setBiddingTime(newAlignment);
                        }
                      }}
                    >
                      <ToggleButton size="medium" value={timeOptions[0]}>{timeOptions[0]}</ToggleButton>
                      <ToggleButton size="medium" value={timeOptions[1]}>{timeOptions[1]}</ToggleButton>
                      <ToggleButton size="medium" value={timeOptions[2]}>{timeOptions[2]}</ToggleButton>
                    </ToggleButtonGroup>
                  </div>                  
                </div>
                <div>
                </div>
              </div>
              <div className="convenience-container">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div>
                    <Input
                      type="number"
                      placeholder="closing time"
                    />
                  </div>
                  <div>
                    <ToggleButtonGroup
                      exclusive
                      value={closingTime}
                      onChange={(event, newAlignment) => {
                        if (newAlignment !== null) {
                          setClosingTime(newAlignment);
                        }
                      }}
                    >
                      <ToggleButton size="medium" value={timeOptions[0]}>{timeOptions[0]}</ToggleButton>
                      <ToggleButton size="medium" value={timeOptions[1]}>{timeOptions[1]}</ToggleButton>
                      <ToggleButton size="medium" value={timeOptions[2]}>{timeOptions[2]}</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
                <div>
                </div>
              </div>
              {/* 
              <div>
              </div>
              <div style={{margin: "20px auto"}}>
              </div>
              <div style={{display: "flex", justifyContent: "space-around", margin: "30px"}}>
                <div>
                  <div style={{display: "flex", justifyContent: "space-around", margin: "10px"}}>
                    <Input 
                      type="number" 
                    />
                  </div>
                </div>
                <div>
                  <div>
                    closing time
                  </div>
                  <div style={{display: "flex", justifyContent: "space-around", margin: "10px"}}>
                    <Input 
                      type="number" 
                    />
                    <Dropdown text={biddingTime}>
                      <Dropdown.Menu>
                        <Dropdown.Item text={timeOptions[0]} onClick={() => {setBiddingTime(timeOptions[0])}} />
                        <Dropdown.Item text={timeOptions[1]} onClick={() => {setBiddingTime(timeOptions[1])}} />
                        <Dropdown.Item text={timeOptions[2]} onClick={() => {setBiddingTime(timeOptions[2])}} />
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div>
                  </div>
                </div>
              </div> */}
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
