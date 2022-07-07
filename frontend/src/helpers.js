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
          '0xf78e737Af8166A9641aF0C45668b61403f480E00',//RankitNft.networks['80001'].address,
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
