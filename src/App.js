import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { ellipsisAddress, fixNFTURL } from './utilities';
import NFT from './NFT';
import './App.css';

function App() {
  const { Moralis } = useMoralis();
  const [ validNetwork, setValidNetwork ] = useState(false);
  const [ wallet, setWallet ] = useState("");
  const [ nfts, setNfts ] = useState([]);

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

    // console.log(NFTs);
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
    </div>
  );
}

export default App;
