import React, { useState } from "react";
import classNames from "classnames";
import { MenuAlt1Icon } from "@heroicons/react/solid";
import NFTCard from "../components/common/NFTCard";
import { galleryData } from "../constants/gallery";
import { Transition } from "@headlessui/react";
import GalleryMenu from "../components/gallery/GalleryMenu";
import { useParams } from "react-router";
import { artData } from "../constants/category";

export default function CollectionPage() {
  console.log(useParams().id);
  const [collectionId, setcollectionId] = useState(useParams().id);
  const [currentCategory, setcurrentCategory] = useState(useParams().id);
  const [currentTab, setcurrentTab] = useState("Auction");
  const [currentData, setcurrentData] = useState(galleryData.onAuction);
  const setCurrentTabByMenu = (curTab) => {
    console.log(curTab);
    switch (curTab) {
      case "Auction": {
        setcurrentTab("Auction");
        setTimeout(() => {
          setcurrentData(galleryData.onAuction);
        }, 1000);
        break;
      }
      case "Buy": {
        setcurrentTab("Buy");
        setTimeout(() => {
          setcurrentData(galleryData.onAuction);
        }, 1000);
        break;
      }
      case "Recent": {
        setcurrentTab("Recent");
        setTimeout(() => {
          setcurrentData(galleryData.newlyMinted);
        }, 1000);
        break;
      }
      case "Ending": {
        setcurrentTab("Ending");
        setTimeout(() => {
          setcurrentData(galleryData.endingSoon);
        }, 1000);
        break;
      }
      default:
        break;
    }
  };

  const currentDataArray = []

  artData.trendingCollections[0].images.map((trendingImage, imageIndex) => {
    
    currentData[imageIndex].imagePath = trendingImage;
    currentDataArray.push(currentData[imageIndex])
  })

  return (
  
    <div>
      <div className=" w-full pt-60 pb-20 text-center lg:text-left flex flex-wrap">
        <img
          alt=""
          src={galleryData.avatarImage}
          className="w-40 h-40 rounded-full absolute z-40 top-40 border-4 border-white"
          style={{ left: "calc(50% - 5rem)" }}
        />
        <div className="absolute left-0 top-0 w-screen h-60">
          <img
            alt=""
            src={galleryData.brandImage}
            className="w-full h-full border border-gray-200 object-cover shadow-lg"
          />
        </div>

        <div className="text-center w-full text-4xl font-medium mt-24">
          {galleryData.title}
        </div>

        

        {/* <div
          className="text-center w-full text-sm text-gray-500 max-w-2xl mx-auto mt-8"
          dangerouslySetInnerHTML={{ __html: galleryData.description }}
        ></div> */}
        <div className="w-full mt-8">
          <div className="w-full flex justify-between pb-2 border-b border-gray-700 text-xl">
           
            <GalleryMenu onChange={setCurrentTabByMenu} />
          </div>
          <div className="w-full lg:h-orow md:h-trow h-frow">  
          <div className="w-full mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
             
            { artData.trendingCollections[0].images.map((trendingImage, imageIndex) => {
                  return (
                    <Transition
                      show = {true}
                      enter="transition-opacity duration-1000"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-1000"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                  
                      <NFTCard
                        cardData={currentDataArray[imageIndex]}
                        key={"auction-" + imageIndex}
                      />

                    </Transition>
                  );
                 
                  }) }
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
