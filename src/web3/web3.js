import React, { useEffect, useState } from 'react';

import getWeb3, { getGanacheWeb3, Web3 } from "../utils/getWeb3";
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';


export default function CreatePage() {

  const [ganacheProvider, setGanacheProvider] = useState('');
  const [web3, setweb3] = useState();
  const [ganacheAccounts, setganacheAccounts] = useState();
  const [accounts, setaccounts] = useState();
  const [balance, setbalance] = useState();
  const [networkId, setnetworkId] = useState();
  const [networkType, setnetworkType] = useState();
  const [hotLoaderDisable, sethotLoaderDisable] = useState();
  const [isMetaMask, setisMetaMask] = useState();
  const [photoNFTFactory, setphotoNFTFactory] = useState();
  const [photoNFTMarketplace, setphotoNFTMarketplace] = useState();
  const [PHOTO_NFT_MARKETPLACE, setPHOTO_NFT_MARKETPLACE] = useState();
  ////////////////
  useEffect(async () => {

    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
    let PhotoNFTFactory = {};
    let PhotoNFTMarketplace = {};
    try {
      PhotoNFTFactory = require("../build/contracts/PhotoNFTFactory.json"); // Load ABI of contract of PhotoNFTFactory
      PhotoNFTMarketplace = require("../build/contracts/PhotoNFTMarketplace.json");
    } catch (e) {
      console.log(e);
    }

    try {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        setweb3(web3);
        let ganacheAccounts = [];

        try {
          ganacheAccounts = await getGanacheAddresses();
        } catch (e) {
          console.log('Ganache is not running');
        }

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');

        let instancePhotoNFTFactory = null;
        let instancePhotoNFTMarketplace = null;
        let PHOTO_NFT_MARKETPLACE;
        let deployedNetwork = null;

        // Create instance of contracts
        if (PhotoNFTFactory.networks) {
          deployedNetwork = PhotoNFTFactory.networks[networkId.toString()];
          if (deployedNetwork) {
            instancePhotoNFTFactory = new web3.eth.Contract(
              PhotoNFTFactory.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instancePhotoNFTFactory ===', instancePhotoNFTFactory);
          }
        }

        if (PhotoNFTMarketplace.networks) {
          deployedNetwork = PhotoNFTMarketplace.networks[networkId.toString()];
          if (deployedNetwork) {
            instancePhotoNFTMarketplace = new web3.eth.Contract(
              PhotoNFTMarketplace.abi,
              deployedNetwork && deployedNetwork.address,
            );
            PHOTO_NFT_MARKETPLACE = deployedNetwork.address;
            console.log('=== instancePhotoNFTMarketplace ===', instancePhotoNFTMarketplace);
            console.log('=== PHOTO_NFT_MARKETPLACE ===', PHOTO_NFT_MARKETPLACE);
          }
        }
        if (instancePhotoNFTFactory) {
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          setInterval(() => {
            setweb3(web3),
              setganacheAccounts(ganacheAccounts),
              setaccounts(accounts),
              setbalance(balance),
              setnetworkId(networkId),
              setnetworkType(networkType),
              sethotLoaderDisable(hotLoaderDisabled),
              setisMetaMask(isMetaMask);
            setphotoNFTFactory(instancePhotoNFTFactory)
            setphotoNFTMarketplace(instancePhotoNFTMarketplace);
            setPHOTO_NFT_MARKETPLACE(PHOTO_NFT_MARKETPLACE);
            refreshValues(instancePhotoNFTFactory);
          }, 5000);
        }
        else{
              setweb3(web3),
              setganacheAccounts(ganacheAccounts),
              setaccounts(accounts),
              setbalance(balance),
              setnetworkId(networkId),
              setnetworkType(networkType),
              sethotLoaderDisable(hotLoaderDisabled),
              setisMetaMask(isMetaMask);
            
        }

      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    // returned function will be called on component unmount 
    return () => {
      clearInterval();
    }
  }, [user.id]);


  const getGanacheAddresses = async () => {
    if (ganacheProvider == '') {
      setGanacheProvider(getGanacheWeb3());
    }
    if (ganacheProvider != '') {
      return await ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  const refreshValues = (instancePhotoNFTFactory) => {
    if (instancePhotoNFTFactory) {
      console.log('refreshValues of instancePhotoNFTFactory');
    }
  }



}
