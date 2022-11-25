import { Component } from '@angular/core';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { Injectable } from '@angular/core';
import { providers } from 'ethers' // providers.BaseProvider
import { environment } from '../environments/environment'
import tokenJson from '../assets/MyOtherToken.json';


import { formatEther, getAddress } from 'ethers/lib/utils';
import { HttpClient } from '@angular/common/http';

// import *as dotenv from "dotenv";
// dotenv.config()

// const ERC20VOTES = "0x3A4a8459f38e131fa5071a3E0444E64313F7343E"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  
  tokenContractAddress: string | undefined;

  wallet: ethers.Wallet | undefined
  provider: ethers.providers.BaseProvider | undefined
  etherBalance: number | undefined
  tokenBalance: number | undefined
  votePower: number | undefined
  tokenContract: ethers.Contract | undefined
  window: any;
  
 

  constructor(private http: HttpClient,){}

createWallet() {
// this.provider = new ethers.providers.Web3Provider(this.window.ethereum)
  this.provider = new ethers.providers.InfuraProvider("goerli", { infura: ['INFURA_API_KEY'] })
  this.wallet = ethers.Wallet.createRandom().connect(this.provider);
  this.http
    .get<any>("http://localhost:3000/token-address")
    .subscribe((ans) => {
     this.tokenContractAddress = ans.result;
    if (this.tokenContractAddress && this.wallet) {
    this.tokenContract = new ethers.Contract(
    this.tokenContractAddress,
    tokenJson.abi,
    this.wallet 
    );
  
  this.wallet.getBalance().then((balanceBn) => {
    this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn))
  });

  this.tokenContract["balanceOf"](this.wallet.address).then(
    (tokenBalanceBn: BigNumber) => {
    this.tokenBalance = parseFloat(
      ethers.utils.formatEther(tokenBalanceBn)
      );
  });
  this.tokenContract["getVotes"](this.wallet.address).then(
    (votePowerBn: BigNumber) => {
    this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn)
    );
    }
    );
    }
    })
  }
  
 


//   async connectWallet() {
//     ethereum.request({ method: 'eth_requestAccounts' });     
// // A Web3Provider wraps a standard Web3 provider, which is
// // // what MetaMask injects as window.ethereum into each page
// // const MetaMaskprovider = new ethers.providers.Web3Provider(window.ethereum)
// // // MetaMask requires requesting permission to connect users accounts
// // await MetaMaskprovider.send("eth_requestAccounts", []);
// // // The MetaMask plugin also allows signing transactions to
// // // send ether and pay to change state within the blockchain.
// // // For this, you need the account signer...
// //   const signer = MetaMaskprovider.getSigner();
// //   this.MMaddress = await signer._address
// //   console.log(this.MMaddress);
//   }


  vote(voteId: string){
    console.log("try to vote" + voteId)
    // this.ballotContract["vote"](voteId)
  }
  request() {
    
    this.http
    .post<any>("http://localhost:3000/request-tokens", {
      address: this.wallet?.address,})
    .subscribe((ans) => {console.log(ans)});
    
    
  }
}
