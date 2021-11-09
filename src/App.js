import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route, useHistory, Link } from 'react-router-dom';
import { ellipsisAddress, fixNFTURL } from './utilities';
import CreateAuction from './CreateAuction';
import { Button } from '@mui/material';
import Home from './Home';
import './App.css';
import "nes.css/css/nes.min.css";
import ViewAuction from './ViewAuction';

function App() {
  const { Moralis, isInitialized } = useMoralis();
  const [ nfts, setNfts ] = useState([]);
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");

  const history = useHistory();

  const networkId = 42;

  const handleAccountsChanged = accounts => {
    if (accounts.length > 0) {
      setWallet(accounts[0]);
    }
    else {
      setWallet('');
    }
  }

  const retrieveNFT = async (address, token, chain) => {
    let meta = await Moralis.Cloud.run("getAddressNFT", {
      address: Web3.utils.toChecksumAddress(address),
      token_id: token, 
      chain: chain
    });
    if (meta.metadata !== undefined) {
      return {...JSON.parse(meta.metadata), ...meta};
    } else if (meta.text !== undefined) {
      return {...JSON.parse(meta.text), ...meta};
    } else if (meta.name !== undefined) {
      return meta;
    }
    return null;
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
      })
      .catch(err => {

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
          Connect to the <b>Kovan</b> network through MetaMask
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
          <Link to="/">
            <img class="logo" src="/logo500.png"></img>
          </Link>
        </h1>
        <div class="navbar">
          <Link to="/"><button type="button" class="nav-button">Home</button></Link>
          <div class="divider"/>
          <Link to="/create"><button type="button" class="nav-button">Create Auction</button></Link>
        </div>
      </div>
      <Switch>
        <Route exact path="/">
          <Home
            Moralis={Moralis}
            isInitialized={isInitialized}
          />          
        </Route>
        <Route path="/create">
          <CreateAuction 
            wallet={wallet}
            nfts={nfts}
            history={history}
            Moralis={Moralis}
            retrieveNFT={retrieveNFT}
            pushNftResult={pushNftResult}
          />          
        </Route>
        <Route path="/auction/:id">
          <ViewAuction 
            Moralis={Moralis}
            isInitialized={isInitialized}
            retrieveNFT={retrieveNFT}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
