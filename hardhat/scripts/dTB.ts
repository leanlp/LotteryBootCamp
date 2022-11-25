import {ethers} from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Console } from "console";
dotenv.config()

const TOKENCONT = "0x06157A790bC1b3f4f337859686C32F0123084331"
// const TOKENCONTLAST = "0x61cB532F2eFc890a3650c68d37B347Cefa052F50"

const WWallet = "0x6f6eb030334642D3D1527B3D1b05fb08C16852d5"
const WWallet4 = "0x2924a6C59115299A5945cA1dF6D73ABA526C97bd"

const PROPOSALS = ["Ethereum", "Bitcoin", "ChiaCoin", "All.LoveForCrypto"];

async function main () {
    // const provider = ethers.getDefaultProvider()
const provider = new ethers.providers.InfuraProvider("goerli", {infura: process.env.INFURA_API_KEY});
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ??"");
const signer = wallet.connect(provider);
console.log(`wallet ${signer.address}`)

const balance = await signer.getBalance();
console.log(`this address has balance of ${balance}`)

const BLOCKNUMBER = provider._getFastBlockNumber()
// const BN = await BLOCKNUMBER
const BN = 7993450



const ballotContractFactory = new TokenizedBallot__factory(signer);
const ballotContract = await ballotContractFactory.deploy(
  convertStringArrayToBytes32(PROPOSALS),
  TOKENCONT,
  (BN ) 
);
// const ballotContract = ballotContractFactory.attach(TOKENCONT)
await ballotContract.deployed()

const hashdeploy= ballotContract.deployed()
console.log(`address new contract ${(await (hashdeploy)).address} `)

// const voteee = await ballotContract.vote(3, 111)
// await voteee.wait()
// const txhashv = voteee.hash
// console.log(`Hash of Vote Proposal 3 ${txhashv} `)

const votingPower = await ballotContract.votingPower(WWallet4)
console.log(`voting power for Wallet ${votingPower} `)


const winnerName = await ballotContract.winnerName()
console.log(ethers.utils.parseBytes32String(winnerName));
console.log(`Proposal Winner is ${ethers.utils.parseBytes32String(winnerName)}`);

// const pastVotes = await ballotContract.votingPower(WWallet)
// const pastVotesW4 = await ballotContract.votingPower(WWallet4)

// console.log(`pastVotes wallet ${pastVotes}`)
// console.log(`voting power in Wallet ${pastVotesW4}`)

const blo = await provider.blockNumber.toString()
console.log(`this is current Block Number in Goerli ${blo}`)
// const blo2 = await provider()
// const MINT_VALUE = ethers.utils.parseEther("10");





// const balance2 = await signer.getBalance();
// console.log(`this address has balance in ETH ${balance2}`)






function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}
for (let index = 0; index < PROPOSALS.length; index++) {
  const proposal = await ballotContract.proposals(index);
  
  console.log("Proposals in this Ballot");
  console.log(ethers.utils.parseBytes32String(proposal.name));

}


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});