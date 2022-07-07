import { ethers } from 'ethers';
const ChefWopNFT = require('./ChefWopNFT.json');


export async function connect() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
        const account = handleAccountsChanged(accounts);
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum); //new ethers.providers.JsonRpcProvider(rpc);
        const { chainId } = await ethersProvider.getNetwork()
        const signer = ethersProvider.getSigner();
        let nftCollection = new ethers.Contract(
          '0x8190f5e070AEcb4387eB07a48f74B3dab135c4B3',//RankitNft.networks['80001'].address,
          ChefWopNFT.abi,
          signer//ethersProvider
        )
        return [ethers.utils.getAddress(account), nftCollection, chainId];
    } catch (error) {
        if (error.code === 4001) {
            alert('Please connect to metamask to continue')
        } else {
            console.error(error)
        }
    }
}

export function handleAccountsChanged(accounts) {
    if (accounts.length === 0 ) {
        console.log("Please connect to metamask")
    } else {

        window.ethereum.on("accountsChanged", () => { window.location.reload() });
        window.ethereum.on('networkChanged', () => { window.location.reload() });

        return accounts[0];
    }
}
