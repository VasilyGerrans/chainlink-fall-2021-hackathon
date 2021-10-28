import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Switch, Route, useHistory } from 'react-router-dom';
import { ellipsisAddress, fixNFTURL } from './utilities';
import CreateAuction from './CreateAuction';
import Home from './Home';
import './App.css';

function App() {
  const { Moralis } = useMoralis();
  const [ nfts, setNfts ] = useState([]);
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
    const options = {chain: 'eth', address: '0x139a0975ea36cec4c59447002a875749ac9c460f'}
    const NFTs = await Moralis.Web3API.account.getNFTs(options);

    console.log(NFTs);

    const arr = [];

    setNftQty(NFTs.total);

    var increment = 0;
    for(var i = 0; i < Math.min(NFTs.result?.length, 5 + increment); i++) {
      try {
        let response = await fetch(NFTs.result[i].token_uri);
        let json = await response.json();
        let src = await fetch(fixNFTURL(json.image));
        if (src.status === 200) {
          arr.push({...json, id: NFTs.result[i].token_address + "-" + NFTs.result[i].token_id});
        }
        else { 
          increment++;
        }
      } catch(err) {
        increment++;
      }
    }

    console.log("arr", arr);
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
          <Home
            history={history}
          />          
        </Route>
        <Route path="/create">
          <CreateAuction 
            nfts={nfts}
            nftQty={nftQty}
            history={history}
          />          
        </Route>
      </Switch>
    </div>
  );
}

export default App;
