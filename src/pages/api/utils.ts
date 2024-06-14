// import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession, Session } from "next-iron-session";
import { Address } from "viem"
import * as util from 'ethereumjs-util'
// import type { IssuerRegistryInterface } from "@/types/IssuerRegistry"
// import { issuerRegistryAbi } from '@/abis/IssuerRegistry';

// import { PROVIDER_URL, CONTRACT_ADDRESS } from "@/config"

export const MESSAGE_SESSION = "message-session"
export const DELETE_WAIT = 200



// const providerNetwork = PROVIDER_URL;
export const contractAddress = process.env.FORGE_CONTRACT_ADDRESS as Address
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string;
export const pinataURI = process.env.PINATA_API_URL as string;
export const pinataToken = process.env.PINATA_TOKEN as string;


// const contractAddress = CONTRACT_ADDRESS as string;

export function withSession( handler: any ) {
  return withIronSession( handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName : 'nft-auth-session',
    cookieOptions: {
      secure: ( process.env.NODE_ENV === 'production' )
    }

  })
}

export const wait = async (time: number): Promise<null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, time)
  });
}


export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session}, 
  res: NextApiResponse) => {
  return new Promise( async (resolve, reject) => {
    const message = req.session.get(MESSAGE_SESSION);
    // const provider = new ethers.JsonRpcProvider( providerNetwork )
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   issuerRegistryAbi,
    //   provider ) as unknown as SmartyPetalsNftMarket
    
    let messageStr = JSON.stringify( message)

    let nonce: string | Buffer = 
      "\x19Ethereum Signed Message:\n" +
      messageStr.length + 
      messageStr;



    nonce = util.keccak(Buffer.from( nonce, "utf8"))


    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v,r,s);
    const addrBuffer = util.pubToAddress(pubKey);
    const address = util.bufferToHex(addrBuffer);

    if( address === req.body.address  ){
      resolve("Correct Address");
    } else {
      reject("Wrong Address");
    }
  })
}