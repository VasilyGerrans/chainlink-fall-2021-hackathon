import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route, useHistory} from 'react-router-dom';
import { HashLink as Link} from 'react-router-hash-link';
import { ellipsisAddress, fixNFTURL } from './utilities';
import CreateAuction from './CreateAuction';
import { Button } from '@mui/material';
import Home from './Home';
import "nes.css/css/nes.min.css";
import 'reactjs-popup/dist/index.css';
import './App.css';
import ViewAuction from './ViewAuction';
import { propTypes } from 'react-bootstrap/esm/Image';

function App() {
  const { Moralis, isInitialized } = useMoralis();
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");
  const [ featuredNft, setFeaturedNft ] = useState({});
  const [ web3, setWeb3 ] = useState();

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
    if (meta !== null) {
      if (meta.metadata !== undefined) {
        return {...JSON.parse(meta.metadata), ...meta};
      } else if (meta.text !== undefined) {
        return {...JSON.parse(meta.text), ...meta};
      } else if (meta.name !== undefined) {
        return meta;
      }
    }
    return null;
  }
  const getFeaturedAuction = async() => {
      let meta = await retrieveNFT("0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270", 78000313, "eth");
      console.log(meta);
      // Show it as an image
      meta.animation_url = null;
      setFeaturedNft(meta);
  }
  
  useEffect(() => {
    (async () => {
      await initWeb3();
      getFeaturedAuction();

      await connect();

      window.ethereum?.on('accountsChanged', handleAccountsChanged);
    })();
  }, []);  

  const initWeb3 = async () => {
    const provider = await detectEthereumProvider();
    console.log(provider);
    const web3 = new Web3("https://kovan.infura.io/v3/416304afa6a24e61934cad318b64884c");

    if (web3 != undefined) {
      await web3.eth.net.getId()
      .then(id => {
        if (Number(id) === networkId) {
          setWeb3(web3);
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
        <Link to="/" style={{textDecoration: 'none'}}>
          <h1 className="tlogo">
            meltdown
          </h1>
        </Link>
        <div className="navbar">
          <Link to="/"><button className="nav-button">Home</button></Link>
          <div className="divider"/>
          <a target="_blank" href="https://nftmelt.org"><button className="nav-button">About</button></a>
          <div className="divider"/>
          <Link to="/create"><button className="nav-button">Create Auction</button></Link>
          <div className="divider"/>
          <Link to="/#liveAuctions"><button className="nav-button">Live Auctions</button></Link>
        </div>
      </div>
      <Switch>
        <Route exact path="/">
          <Home
            Moralis={Moralis}
            isInitialized={isInitialized}
            featuredNft={featuredNft}
            web3={web3}
          />          
        </Route>
        <Route path="/create">
          <CreateAuction 
            wallet={wallet}
            Moralis={Moralis}
            history={history}
            retrieveNFT={retrieveNFT}
          />          
        </Route>
        <Route path="/auction/:id">
          <ViewAuction 
            Moralis={Moralis}
            isInitialized={isInitialized}
            retrieveNFT={retrieveNFT}
            web3={web3}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
