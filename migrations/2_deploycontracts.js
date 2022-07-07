const ChefWopNFT = artifacts.require('ChefWopNFT.sol');

module.exports = async function (deployer, network, addresses ) {
  /*const [admin, payer, payer2, payer3, _] = addresses;
  console.log(admin);
  console.log(payer);
  console.log(addresses);*/
  if(network==="mumbai" || network==='rinkeby') {
    await deployer.deploy(ChefWopNFT, "ChefWopNFT", "CHFWPNFT","https://nodeapi.rankit.it/static/nft/json/");
    const chefWopNFT = await ChefWopNFT.deployed();
    console.log("Success! Contract was deployed to: ", chefWopNFT.address);
  } 
};
