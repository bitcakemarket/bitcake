import {
  ClockIcon,
  DuplicateIcon,
  GiftIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import Avatar from "../../../components/stats/profile/avatar";
import Banner from "../../../components/stats/profile/banner";
import {
  CogIcon,
  CurrencyDollarIcon,
  ShareIcon,
  TagIcon,
  SaveIcon
} from "@heroicons/react/solid";
import NFTCard from "../../../components/common/NFTCard";
import CustomTooltip from "../../../components/common/tooltip";
import { Link, useLocation } from "react-router-dom";
import { userSelector } from "../../../redux/auth/selector";
import { useDispatch } from "react-redux";
import { uploadAvatar, uploadBanner } from "../../../redux/auth/action";

import getWeb3, { getGanacheWeb3, Web3 } from "../../../utils/getWeb3";
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';
import ipfs from '../../../ipfs/ipfsApi.js'
const category = [
  {
    icon: <TagIcon className="w-7 h-7 mr-2" />,
    text: "In Wallet",
  },
  {
    icon: <ClockIcon className="w-7 h-7 mr-2" />,
    text: "Activity",
  },
  {
    icon: <GiftIcon className="w-7 h-7 mr-2" />,
    text: "Offers",
  },
  {
    icon: <HeartIcon className="w-7 h-7 mr-2" />,
    text: "Favorites",
  },
  {
    icon: <CurrencyDollarIcon className="w-7 h-7 mr-2" />,
    text: "Referrals",
  },
];

const walletItems = [
  {
    favourites: 5,
    cardType: "image",
    videoPath: "",
    audioPath: "",
    imagePath:
      "https://lh3.googleusercontent.com/lYJHuLrkZrCBoRyOviM8xuibyzyUU3GahfJaZv3rW6h4hIiAvWmeLtTwAqb8lxLk3GUAA1OSH_uRlmubUtd6SXdI-cMeptKnY6JrXg=s302",
    avatarPath: "/assets/images/avatars/avatar.jpg",
    subCategory: "Sports",
    title: "ZED RUN",
    subtitle: "Feel the thunder",
    priceType: "bnb",
    priceTitle: "Current Bid",
    price: "0.55 BNB",
    extraType: "none",
    daysLeft: 0,
    offerFor: 0,
    last: 0,
    endingIn: "Auction has ended",
  },
  {
    favourites: 4,
    cardType: "audio",
    videoPath: "",
    audioPath: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
    imagePath:
      "https://lh3.googleusercontent.com/OWv7wjmQmfFB6-K4lj8Uux6lVhgP1NcPyykjeNR6OL_PPFibmwZ_qg6fO5oivpMlFYJOAXXID1prb11nPROLFkZezFAMVewUFpzesw=s265",
    avatarPath: "/assets/images/avatars/avatar.jpg",
    subCategory: "Sports",
    title: "Slabs",
    subtitle: "2017 PANINI PRIZM #191 LeBRON JAMES PSA 10 GEM MT",
    priceType: "bnb",
    priceTitle: "Current Bid",
    price: "0.55 BNB",
    extraType: "none",
    daysLeft: 0,
    offerFor: 0,
    last: 0,
    endingIn: "Auction has ended",
  },
  {
    favourites: 5,
    cardType: "image",
    videoPath: "",
    audioPath: "",
    imagePath:
      "https://lh3.googleusercontent.com/rUDaauhOwbb2FVfofPFi_dNPzM6ZKMZvHeYOId-EAIA8fHjXpg7P1lE_DM6Tn4FQ3WWxe7DstaIqZVx0svqITjPuioAJbaz2-s693DQ=s302",
    avatarPath: "/assets/images/avatars/avatar.jpg",
    subCategory: "Sports",
    title: "ZED RUN",
    subtitle: "Feel the thunder",
    priceType: "bnb",
    priceTitle: "Current Bid",
    price: "0.55 BNB",
    extraType: "none",
    daysLeft: 0,
    offerFor: 0,
    last: 0,
    endingIn: "Auction has ended",
  },
  {
    favourites: 5,
    cardType: "audio",
    videoPath: "",
    audioPath: "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3",
    imagePath:
      "https://lh3.googleusercontent.com/q92sMO7GyqyPzBCUs8L1SjLqmo62IwcwkEXh1pgrFUyhvRrVpy-WHztoDPwjA-6pLtwzLA6cWvde2pAStNjgetyM-oNtGFIZDjuz=s302",
    avatarPath: "/assets/images/avatars/avatar.jpg",
    subCategory: "Sports",
    title: "ZED RUN",
    subtitle: "Feel the thunder",
    priceType: "bnb",
    priceTitle: "Current Bid",
    price: "0.55 BNB",
    extraType: "none",
    daysLeft: 0,
    offerFor: 0,
    last: 0,
    endingIn: "Auction has ended",
  },
];

export default function ProfilePage() {

  const [ganacheProvider, setGanacheProvider] = useState('');
  const [web3, setweb3] = useState();
  const [ganacheAccounts, setganacheAccounts] = useState();
  const [accounts, setaccounts] = useState();
  const [balance, setbalance] = useState();
  const [networkId, setnetworkId] = useState();
  const [networkType, setnetworkType] = useState();
  const [hotLoaderDisable, sethotLoaderDisable] = useState();
  const [isMetaMask, setisMetaMask] = useState();
  const [NFTOwnerData, setNFTOwnerData] = useState();
  const [photoNFTMarketplace, setphotoNFTMarketplace] = useState();
  const [PHOTO_NFT_MARKETPLACE, setPHOTO_NFT_MARKETPLACE] = useState();

  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const [copyText, setcopyText] = useState("Copy");
  const [avatarImage, setavatarImage] = useState("");
  const [bannerImage, setbannerImage] = useState("");

  const location = useLocation();
  const { pathname } = location;

  const [avatarBuffer, setAvatarBuffer] = useState(null);
  const [bannerBuffer, setBannerBuffer] = useState(null);
  

  const [currentTab, setcurrentTab] = useState(
    pathname.indexOf("profile") > 0 ? category[0] : category[3]
  );

  const changeAvatar = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    dispatch(uploadAvatar({file: file, address: user.address, type: "avatar"}));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setavatarImage(reader.result);
      setAvatarBuffer(Buffer(reader.result));
    };
  };

  const changeBanner = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    dispatch(uploadBanner({file: file, address: user.address, type: "banner"}));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      
      setbannerImage(reader.result);
      setBannerBuffer(Buffer(reader.result));
    };
  };

  const saveProfile = () => {
    if(bannerBuffer != null){
      ipfs.files.add(bannerBuffer, (error, result) => {
        if (error) {
          console.error(error);
          return
        }
        const ipfsHashOfBanner = result[0].hash;
        NFTOwnerData.methods.update_Banner(ipfsHashOfBanner).send({ from: accounts[0] });
    })
  }

    if(avatarBuffer != null) {
      ipfs.files.add(avatarBuffer, (error, result) => {
        if (error) {
          console.error(error);
          return
        }
        console.log(result[0].hash);
        const ipfsHashOfAvatar = result[0].hash;
        NFTOwnerData.methods.update_Avartar(ipfsHashOfAvatar).send({ from: accounts[0] });
    })
    }
  }

  const toggleTap = (item) => {
    if(currentTab.text != "Favorites")
     setcurrentTab(category[3]);
    else setcurrentTab(category[0]);
  }

  useEffect(async () => {

    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
    let NFTOwnerData = {};
    let PhotoNFTMarketplace = {};
    try {
      NFTOwnerData = require("../build/contracts/NFTOwnerData.json"); // Load ABI of contract of NFTOwnerData
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

        let instanceNFTOwnerData = null;
        let instancePhotoNFTMarketplace = null;
        let PHOTO_NFT_MARKETPLACE;
        let deployedNetwork = null;

        // Create instance of contracts
        if (NFTOwnerData.networks) {
          deployedNetwork = NFTOwnerData.networks[networkId.toString()];
          if (deployedNetwork) {
            instanceNFTOwnerData = new web3.eth.Contract(
              NFTOwnerData.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instanceNFTOwnerData ===', instanceNFTOwnerData);
          }
        }

       
        if (instanceNFTOwnerData) {
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
            setNFTOwnerData(instanceNFTOwnerData)
            refreshValues(instanceNFTOwnerData);
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

  const refreshValues = (instanceNFTOwnerData) => {
    if (instanceNFTOwnerData) {
      console.log('refreshValues of instanceNFTOwnerData');
    }
  }


  return (
    <div>
      <div className=" w-full pt-60 pb-20 text-center lg:text-left flex flex-wrap">
        <Avatar
          avatarPath={avatarImage == "" ? (user.avatar == null ? "https://www.seekpng.com/png/detail/245-2454602_tanni-chand-default-user-image-png.png" : `${process.env.REACT_APP_API_PATH}/${user.avatar}`) : avatarImage}
          showButton={true}
          onChange={changeAvatar}
        />
        <Banner
          bannerPath={bannerImage == "" ? `${process.env.REACT_APP_API_PATH}/${user.banner}` : bannerImage}
          showButton={true}
          onChange={changeBanner}
        />
        <div className="w-full flex justify-end items-center p-4 space-x-4">
          <Link
            to="/account/settings"
            className="hover:shadow-dark p-3 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            data-tip
            data-for="settings"
          >
            <CogIcon className="w-7 h-7" />
          </Link>
          <button
            className="hover:shadow-dark p-3 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none"
            data-tip
            data-for="save"
            onClick={() => {
              saveProfile();
            }}
          >
            <SaveIcon className="w-7 h-7" />
          </button>
          <CustomTooltip id="settings" label="Settings" />
          <CustomTooltip id="save" label="Save" />
        </div>

        <div className="text-center w-full text-4xl font-medium mt-10">
          {user.name}
        </div>
        <div className="w-full flex justify-center items-center mt-4">
          <div className="text-center w-40 truncate">{user.address}</div>
          <DuplicateIcon
            className="w-5 h-5 ml-3 cursor-pointer focus:outline-none"
            data-tip
            data-for="copy"
            onClick={() => {
              navigator.clipboard.writeText(user.address);
              setcopyText("Copied!");
            }}
            onMouseEnter={() => {
              setcopyText("Copy");
            }}
          />
          <ReactTooltip id="copy" type="dark" effect="solid" className="w-20">
            <span className="w-10">{copyText}</span>
          </ReactTooltip>
        </div>

        <div className="w-full flex items-center space-x-3 mt-10">
          {category.map((item, index) => (
            item.text == "Favorites" ?
            (<div
              key={`item-${index}`}
              className={`p-2 flex items-center rounded-md cursor-pointer ${
                currentTab.text === item.text
                  ? "bg-primary-dark text-white"
                  : "text-gray-700"
              }`}
              onClick={() => {
                toggleTap(item);
              }}
            >
              {item.icon}
              <div className="text-xl font-bold">{item.text}</div>
            </div>) : ""
          ))}
        </div>

        <div className="w-full mt-10">
          {
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              {walletItems.map((walletItem, itemIndex) => {
                return (
                  <NFTCard cardData={walletItem} key={"wallet-" + itemIndex} />
                );
              })}
            </div>
          }
        </div>
      </div>
    </div>
  );

}
