const { Contract, providers } = require("ethers");
const L2NftContractAbi = require("./abi/L2NftContractAbi.json");

const L2NftContractAddress = "0xebca6f81396b601449a008499b2a5a7f9626ab90";
const L2TokenId = "293800535098486187010428502446247754593808555329";

const GodwokenTestnetRpc = "https://v1.testnet.godwoken.io/rpc";

async function getL2Nrc721Info() {
  const provider = new providers.JsonRpcProvider(GodwokenTestnetRpc);
  const l2NftContract = new Contract(L2NftContractAddress, L2NftContractAbi, provider);

  const [
    name, symbol, tokenURI,
    tokenName, tokenSymbol, tokenData, tokenExtraData
  ] = await Promise.all([
    l2NftContract.name(),
    l2NftContract.symbol(),
    l2NftContract.tokenURI(L2TokenId),
    l2NftContract.tokenName(L2TokenId),
    l2NftContract.tokenSymbol(L2TokenId),
    l2NftContract.tokenData(L2TokenId),
    l2NftContract.tokenExtraData(L2TokenId),
  ]);

  console.log("original methods");
  console.log("-- name:", name);
  console.log("-- symbol:", symbol);
  console.log("override methods");
  console.log("-- tokenURI:", tokenURI);
  console.log("additional methods");
  console.log("-- tokenName:", tokenName);
  console.log("-- tokenSymbol:", tokenSymbol);
  console.log("-- tokenData:", tokenData);
  console.log("-- tokenExtraData:", tokenExtraData);
}

function main() {
  getL2Nrc721Info();
}

main();
