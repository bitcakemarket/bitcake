import React, { useEffect, useState } from 'react';
import NFTDropzone from '../components/common/nftDropzone';
import { Editor } from '@tinymce/tinymce-react';
import CurrencyInput from 'react-currency-input-field';
import Switch from 'react-switch';
import CustomButton from '../components/common/Button';
import CreatableSelect from 'react-select/creatable';
import TagInput from '../components/common/taginput';
import {
  categories,
  subCategories,
  priceTypes,
  auctionlengths,
} from '../constants/create';
import { useSelector } from 'react-redux';
import CustomListBox from '../components/common/customlistbox';
import axios from 'axios';
import { tokenSelector, userSelector } from '../redux/auth/selector';
import { getCollections } from '../services/collection';
import { createNotification } from '../App';
import ipfs from '../ipfs/ipfsApi.js'
import getWeb3, { getGanacheWeb3, Web3 } from "../utils/getWeb3";
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

const bnbRate = 277.34;

///--------------------------
/// Functions of ipfsUpload 
///-------------------------- 


const uploadFile = async (file, type, extension, token) => {
  const data = new FormData();
  data.append('file', file);
  data.append('type', type);
  data.append('extension', extension);
  data.append('token', token);
  const res = await axios.post(
    process.env.REACT_APP_API_PATH + `/api/v1/private/upload/file`,
    data,
    {
      'Content-Type': 'multipart/form-data',
    }
  );
  return res.data.result;
};

export default function CreatePage() {
  const user = useSelector(userSelector);
  const token = useSelector(tokenSelector);

  const [mainCategory, setmainCategory] = useState(categories[0]);
  const [subCategory, setsubCategory] = useState(subCategories[0]);
  const [newCollection, setnewCollection] = useState(false);
  const [collection, setcollection] = useState();
  const [tags, settags] = useState([]);
  const [title, settitle] = useState('');
  const [imagefile, setimageFile] = useState();
  const [videofile, setvideoFile] = useState();
  const [audiofile, setaudioFile] = useState();
  const [collectionfile, setcollectionfile] = useState();
  const [isattach, setisattach] = useState(false);
  const [attachfile, setattachfile] = useState();
  const [description, setdescription] = useState();
  const [pricetype, setpricetype] = useState(priceTypes[0]);
  const [currencytype, setcurrencytype] = useState(false);
  const [price, setprice] = useState(0);
  const [buynowprice, setbuynowprice] = useState(0);
  const [auctionlength, setauctionlength] = useState(auctionlengths[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [ganacheProvider, setGanacheProvider] = useState('');
  ///////////
  const [buffer, setBuffer] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const captureFile = (file) => {

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)  // Read bufffered file

    // Callback
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result))
    }

  }

  const captureAudioFile = (file) => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setAudioBuffer(Buffer(reader.result))
    }
  }

  const numberToBN = require('number-to-bn');

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

  // console.log(token);
  // if(!token)
  //   return <Redirect to="/login" />

  const handleChange = (newValue, actionMeta) => {
    setcollection(newValue);
    if (actionMeta.action === 'create-option') {
      setnewCollection(true);
    } else setnewCollection(false);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
      
      if(audioBuffer != null && buffer != null){
        ipfs.files.add(buffer, (error, result) => {
          if (error) {
            console.error(error);
            return
          }
          const ipfsHashOfPhoto_background = result[0].hash;
          console.log('=== ipfsHash_background ===', result[0].hash);    
        });  
      }
      ipfs.files.add(audioBuffer != null ? audioBuffer : buffer, (error, _result) => {
        if (error) {
          console.error(error);
          return
        }

      console.log('=== ipfsHash ===', _result[0].hash);
      const ipfsHashOfPhoto = _result[0].hash;

      const nftdata = {
        maincategory: mainCategory.name,
        subcategory: subCategory.name,
        title: title,
        tags: tags,
        isattach: false,
        description: description,
        transfercopyright: false,
        currencytype: currencytype === false ? 'usd' : 'bnb',
        pricetype: pricetype.name,
        price: web3.utils.toWei(price.toString(), "ether"),
        buynowprice: buynowprice,
        auctionlength: auctionlength.value,
      };

      let PHOTO_NFT;  /// [Note]: This is a photoNFT address created
      const photoPrice = web3.utils.toWei(price.toString(), "ether");
      const nftSymbol = "NFT-MARKETPLACE";  /// [Note]: All NFT's symbol are common symbol
      console.log('=== photoPrice ===', nftdata.price);
      const photoMeta = nftdata.maincategory + '::' + nftdata.subcategory + '::' + nftdata.tags + '::' + nftdata.currencytype + '::' + nftdata.pricetype;
      photoNFTFactory.methods.createNewPhotoNFT(nftdata.title, nftSymbol,  nftdata.price, ipfsHashOfPhoto, photoMeta).send({ from: accounts[0] })
        .once('receipt', (receipt) => {
          console.log('=== receipt ===', receipt);

          const PHOTO_NFT = receipt.events.PhotoNFTCreated.returnValues.photoNFT;
          console.log('=== PHOTO_NFT ===', PHOTO_NFT);

          /// Get instance by using created photoNFT address
          let PhotoNFT = {};
          PhotoNFT = require("../build/contracts/PhotoNFT.json");
          let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
          console.log('=== photoNFT ===', photoNFT);

          /// Check owner of photoId==1
          const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
          photoNFT.methods.ownerOf(photoId).call().then(owner => console.log('=== owner of photoId 1 ===', owner));

          /// [Note]: Promise (nested-structure) is needed for executing those methods below (Or, rewrite by async/await)
          photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] }).once('receipt', (receipt) => {
            /// Put on sale (by a seller who is also called as owner)
            photoNFTMarketplace.methods.openTradeWhenCreateNewPhotoNFT(PHOTO_NFT, photoId, photoPrice).send({ from: accounts[0] }).once('receipt', (receipt) => { })
          })
            .then(() => {
              console.log("Publised it successfully");
            })
        })
      setIsSaving(false);
    })
  };

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


  return (
    <div className="w-full pt-20 pb-20 text-center lg:text-left flex flex-wrap">
      <div className="w-full border-b border-gray-400 py-2 text-gray-700 font-bold text-3xl text-center">
        Create and List an item for sale
      </div>
      <div className="w-full space-y-6 p-4">
        <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">
            Select Category
          </div>
          <div className="w-full">
            <CustomListBox
              value={mainCategory}
              onChange={setmainCategory}
              data={categories}
            />
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">
            Select Sub Category
          </div>
          <div className="w-full">
            <CustomListBox
              value={subCategory}
              onChange={setsubCategory}
              data={subCategories}
            />
          </div>
        </div>

        {/* <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">
            Select Collection
          </div>
          <div className="w-full">
            <CreatableSelect
              isClearable
              placeholder="Create or select collection"
              onChange={handleChange}
              // onInputChange={this.handleInputChange}
              options={collectionList}
              className="z-10 text-sm rounded-lg shadow-md border-gray-600 cursor-pointer"
              classNamePrefix="react-select"
            />
          </div>
        </div> */}

        <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">
            Listing Title
          </div>
          <input
            type="text"
            className="p-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light w-full"
            value={title}
            onChange={(e) => {
              settitle(e.target.value);
            }}
          />
        </div>

        <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">Tags ( # )</div>
          <TagInput
            tags={tags}
            onChange={(newTags) => {
              settags(newTags);
            }}
          />
        </div>

        <div className="w-full space-y-2">
          <div className="text-md text-gray-600 font-semibold">
            Upload item preview images
            <br />
            <div className="text-sm">
              The first preview image you upload will be displayed on all
              wallets as the token image!
            </div>
            <div className="font-bold">
              NOTE: Upload audio only if you are selling an audio NFT.{' '}
            </div>
          </div>
          <div className="w-full border-dashed border-2 rounded-md border-gray-300 flex items-center justify-center cursor-pointer">
            <NFTDropzone
              nftType={mainCategory.name == "Audio" ? "custom" : "Image"}
              onChange={(newfile) => {
                console.log(newfile);
                captureFile(newfile);
              }}
            />
            {mainCategory.name === 'Audio' && (
              <NFTDropzone
                nftType={mainCategory}
                onChange={(newfile) => {
                  captureAudioFile(newfile);
                }}
              />
            )}
            {/* {newCollection && (
              <NFTDropzone 
                nftType="Collection"
                // onChange={(newfile) => {
                //   setcollectionfile(newfile);
                // }}
                onChange={(newfile) => {
                  captureFile(newfile);
                }}
              />
            )} */}
          </div>
        </div>

        <div className="w-full cursor-pointer flex items-center space-x-3">
          <input
            type="checkbox"
            className="cursor-pointer w-5 h-5 focus:outline-none border rounded-md focus:ring-none checked:bg-primary-dark checked: border-none"
            checked={isattach}
            onChange={() => {
              setisattach(!isattach);
            }}
          />
          <span>Attach a private file/unlockable content?</span>
        </div>
        {isattach && (
          <NFTDropzone
            nftType={'all'}
            onChange={(newfile) => {
              captureFile(newfile);
            }}
          />
        )}

        <div className="w-full space-y-2">
          <span>Item description</span>
          <Editor
            init={{
              height: 400,
              menubar: false,
              plugins: 'link image code',
              toolbar:
                'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
              placeholder:
                'The better the description the higher chance of selling your item...',
            }}
            onChange={(e) => {
              setdescription(e.target.getContent());
            }}
          />
        </div>

        <div className="w-full cursor-pointer flex items-center space-x-3">
          <input type="checkbox" className="cursor-pointer w-5 h-5" />
          <span>Transfer Copyright when purchased?</span>
        </div>
      </div>
      <div className="w-full space-y-6 p-4 pt-10">
        <div className="text-xl font-bold w-full pb-3 border-b border-gray-400">
          Price and type
        </div>

        <div className="w-full">
          <CustomListBox
            value={pricetype}
            onChange={setpricetype}
            data={priceTypes}
          />
        </div>

        <div className="w-full grid grid-cols-2">
          <div className="space-y-4">
            <div className="w-full text-md font-bold">
              {pricetype.name === 'Fixed'
                ? 'Fixed price'
                : 'Starting Bid Price'}{' '}
              - in {currencytype === false ? 'USD' : 'BNB'}
            </div>

            <div className="w-full flex flex-wrap items-center space-y-3">
              <div className="w-full flex items-center">
                <CurrencyInput
                  defaultValue={0}
                  decimalsLimit={6}
                  onValueChange={(value, name) => {
                    console.log(value);
                    setprice(value);
                  }}
                  className="p-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light w-40"
                />
                <span className="text-md px-3">
                  {currencytype === false ? '$' : 'bnb'}
                </span>
                <label className="flex items-center">
                  <Switch
                    onChange={() => {
                      setcurrencytype(!currencytype);
                    }}
                    checked={currencytype}
                    height={26}
                  />
                </label>
              </div>
              {currencytype === false && (
                <div className="w-full">
                  <div className="text-md text-primary-dark flex">
                    Price in BNB:
                    <div className="pl-2">{(price / bnbRate).toFixed(6)}</div>
                  </div>
                  <div className="text-md flex">
                    current BNB price: 1 BNB = $<div>{bnbRate}</div>
                  </div>
                </div>
              )}
              {currencytype === true && (
                <div className="w-full">
                  <div className="text-md text-primary-dark flex">
                    Price in USD:
                    <div className="pl-2">{(price * bnbRate).toFixed(2)}</div>
                  </div>
                  <div className="text-md flex">
                    current BNB price: 1 BNB = $<div>{bnbRate}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {pricetype.name === 'Auction with Buy Now' && (
            <div className="space-y-4">
              <div className="w-full text-md font-bold">
                Buy Now Price - in {currencytype === false ? 'USD' : 'BNB'}
              </div>

              <div className="w-full flex flex-wrap items-center space-y-3">
                <div className="w-full flex items-center">
                  <CurrencyInput
                    defaultValue={0}
                    decimalsLimit={6}
                    onValueChange={(value, name) => {
                      setbuynowprice(value);
                    }}
                    className="p-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light w-40"
                  />
                  <span className="text-md px-3">
                    {currencytype === false ? '$' : 'bnb'}
                  </span>
                </div>
                {currencytype === false && (
                  <div className="w-full">
                    <div className="text-md text-primary-dark flex">
                      Price in BNB:
                      <div className="pl-2">
                        {(buynowprice / bnbRate).toFixed(6)}
                      </div>
                    </div>
                  </div>
                )}
                {currencytype === true && (
                  <div className="w-full">
                    <div className="text-md text-primary-dark flex">
                      Price in USD:
                      <div className="pl-2">
                        {(buynowprice * bnbRate).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-full max-w-lg">
          <div className="space-y-4">
            <div className="w-full text-md font-bold">Auction length</div>
            <div className="w-full">
              <CustomListBox
                value={auctionlength}
                onChange={setauctionlength}
                data={auctionlengths}
              />
            </div>
          </div>
        </div>
        <CustomButton
          label={!isSaving ? "LIST THIS ITEM" : "Publishing..."}
          styled="solid"
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </div>
  );
}
