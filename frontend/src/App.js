import styled from 'styled-components';
import { NFTCard, NftPhoto } from './components/NFTCard';
import { useState, useEffect } from "react"
import { NFTModal } from './components/NFTModal';
import { ethers } from 'ethers';
import web3 from 'web3';
import moment from 'moment';
import { connect } from './helpers';
//import { connect } from './ethereumx2.js';
const RankitNft = require('./ChefWopNFT.json');
const config = require('./config.json');
const axios = require('axios');

function App() {

  let initialNfts =
  [
    { id: 1, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 2, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 3, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 4, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 5, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 6, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 7, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" },
    { id: 8, name: "", symbol: "CHFWP0x0NFT", copies: 0, image: "https://nodeapi.rankit.it/static/nft/assets/placeholder.png" } 
  ]

  const [showModal, setShowModal] = useState(false)
  const [selectedNft, setSelectedNft] = useState()
  const [selectedNftId, setSelectedNftId] = useState()
  const [nfts, setNfts] = useState(initialNfts)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [pk,setPk] = useState(null);
  const [chainId, setChainId] = useState(0);
  const [nftCollection, setNftCollection] = useState(null);
  const [isMint, setIsMint] = useState(0);
  const [isMeta, setIsMeta] = useState(0);
  //const [get, setCurrentAddress] = useState(null)

  useEffect( () => {

    ( async () => {
      const values = await connect()
      if (values) {
        console.log(values[1]);
        console.log(config.pk);
        //let account = ethers.utils.getAddress(address);
        if(values[2]==4) {
          setCurrentAddress(values[0]);
          setNftCollection(values[1]);
          setChainId(values[2]);
          getNfts(values[0],values[1])
          setIsMint(0);
          setIsMeta(1);
        }
      } else {
        //
      }
    })()

  }, [])


  function toggleModal(i) {
    if (i >= 0) {
      console.log(i);
      setSelectedNft(nfts[i])
      setSelectedNftId(i+1)
    }
    setShowModal(!showModal)
  }

  async function getMetadataFromIpfs(tokenURI) {
    let metadata = await axios.get(tokenURI)
    return metadata.data
  }

  async function mint(val, address, nftCollection, isMint) {
    /*
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum); //new ethers.providers.JsonRpcProvider(rpc);
    const { chainId } = await ethersProvider.getNetwork()
    const signer = ethersProvider.getSigner();
    let nftCollection = new ethers.Contract(
      '0x71e9204405C17d726b3A3AbE56aA4fFC26F66375',//RankitNft.networks['80001'].address,
      RankitNft.abi,
      signer//ethersProvider
    )*/
    //alert(val);
    //alert(address);
    //return false;

    const rval = parseInt(moment().unix());
    const message = web3.utils.soliditySha3({t:'uint256',v:1},{t:'uint256',v:val},{t:'uint256',v:rval}).toString('hex');
    const web3_ = new web3('');
    const {signature} = web3_.eth.accounts.sign(message,config.pk);
    console.log(val);
    console.log('Message Hash: '+message);
    console.log('Signature: '+signature);

    try {
      let mint_ = await nftCollection.mint(1, val, rval, signature);
      setIsMint(1);
      await mint_.wait();
      console.log(mint_.hash);
      window.location.reload();
    } catch(err) {
      console.log(err);
      //console.log(err.data.message);
    }
  }

  async function getNfts(address, nftCollection) {
    console.log(nftCollection);
    let numberOfNfts = (await nftCollection.tokenCount()).toNumber()
    console.log(numberOfNfts);
    let collectionSymbol = await nftCollection.symbol()
    console.log(collectionSymbol);

    let accounts = Array(initialNfts.length).fill(address)
    let ids = Array.from({length: initialNfts.length}, (_, i) => i + 1);
    console.log(ids);
    let copies = await nftCollection.balanceOfBatch(accounts, ids)
    console.log(copies);

    let tempArray = []
    //let baseUrl = await nftCollection.uri(i);
    let baseUrl = "https://nodeapi.rankit.it/nft/json/";
    console.log(initialNfts);
    for (let i = 1; i <= initialNfts.length ; i++) {
      console.log(i);
      if (i === 1) {
        console.log(baseUrl + `${i}`);
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}`)
        metadata.symbol = collectionSymbol
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
        console.log(metadata);
      } else {
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}`)
        metadata.symbol = collectionSymbol
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
      }
    }
    setNfts(tempArray)
  }
  return (
    <div className="App">
      <Container>
        {isMeta==1 &&
          <>
        <Title>Choose your favorite ChefWop0x0 card and mint your NFT!</Title>
        <Subtitle><p>&nbsp;</p>
        </Subtitle>
        </>
        }
        {isMeta==1 &&
        <Grid>
          {
            nfts.map((nft, i) =>
              <NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
            )
          }
        </Grid>
        }
        {isMeta==0 &&
          <Subtitle3>To use this app you need to connect your Metamask to Rinkeby network!</Subtitle3>
        }
        <Footer><Subtitle2>Copyright © 2022 ChefWop0x0</Subtitle2></Footer>
      </Container>
      {
        showModal &&
        <NFTModal
          nft={selectedNft} nftId={selectedNftId} mint={mint} currentAddress={currentAddress} nftCollection={nftCollection} isMint={isMint}
          toggleModal={() => toggleModal()}
        />
      }
    </div>
  );
}

const Footer = styled.div`
  width: 100%;
  text-align: center;
  margin-top:100px;
  margin-bottom:20px;
`
const Title = styled.h1`
  margin: 0;
  margin-top: 0px;
  text-align: center;
`
const Subtitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center;
`
const Subtitle3 = styled.h3`
  margin-top: 20;
  text-align: center;
  font-size:40px;
`
const Subtitle2 = styled.h5`
  color: gray;
  margin-top: 0;
  text-align: center;
`

const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 20px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;

  @media(max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export default App;
