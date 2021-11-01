import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ellipsisAddress, fixNFTURL } from './utilities';
import CreateAuction from './CreateAuction';
import { Button } from '@mui/material';
import Home from './Home';
import './App.css';

function App() {
  const { Moralis } = useMoralis();
  const [ nfts, setNfts ] = useState([]);
  const [ rawAddressResults, setRawAddressResults ] = useState({});
  const [ nftQty, setNftQty ] = useState(0);
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");

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
    /* const result = await Moralis.Cloud.run("testRequest", {url: "https://goblingoonslair.com/goblin/775"});
    console.log(result); */
    // const nftDigest = await Moralis.Cloud.run("getAddressNFTs", {address: "0x139a0975ea36cec4c59447002a875749ac9c460f", amount: 10});
    // console.log(nftDigest);
    //setNfts(nftDigest);
  }

  useEffect(() => {
    (async () => {
      await initWeb3();
      await connect();

      window.ethereum?.on('accountsChanged', handleAccountsChanged);
    })();
  }, []);

  const pushNftResult = async newResult => {
    try {
      let response = await fetch(newResult.token_uri);
      let json = await response.json();
      let src = await fetch(fixNFTURL(json.image));
      let arr = nfts;
      arr.unshift(src);
      arr.pop();
      setNfts(src);
      return src;
    } catch (err) {
      console.log(newResult);
      let src = {
        name: newResult.name ? newResult.name : "Failed to load name", 
        description: newResult.description ? newResult.description : "", 
        image: "#"
      };
      let arr = nfts;
      arr.unshift(src);
      arr.pop();
      return src;
    }
  }

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
          <Button onClick={requestConnect}>
            Connect Wallet
          </Button>
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
          <Home
            history={history}
          />          
        </Route>
        <Route path="/create">
          <CreateAuction 
            wallet={wallet}
            nfts={nfts}
            nftQty={nftQty}
            history={history}
            Moralis={Moralis}
            pushNftResult={pushNftResult}
            rawAddressResults={rawAddressResults}
          />          
        </Route>
      </Switch>
    </div>
  );
}

export default App;
