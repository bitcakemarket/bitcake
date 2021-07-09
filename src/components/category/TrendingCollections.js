import React from "react";
import { Link } from "react-router-dom";
import { artData } from "../../constants/category";

export default function TrendingCollections() {
    const blankStyle = {
      background:"pink"
    }
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-end border-b border-gray-400 pb-2">
        <div className="font-bold font-hakuna text-xl text-gray-700">
          TRENDING COLLECTIONS
        </div>
        <Link
          to={`/collections`}
          className="flex items-center cursor-pointer"
        >
          <div className="text-md font-hakuna text-gray-500 cursor-pointer hover:scale-102">
            View all
          </div>
        </Link>
      </div>
      <div className="w-full mt-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">

        {artData.trendingCollections[0] == null ? <Link key={"trending-" + 0}  style={blankStyle}><div className="relative rounded-md overflow-hidden"></div></Link> :
         <Link key={"trending-" + 0} to={`/collections/${0}`}>
            <div className="relative rounded-md overflow-hidden">
              <div className="grid grid-cols-2 grid-rows-2">
                { artData.trendingCollections[0].images.map((trendingImage, imageIndex) => (
                  <img
                    src={trendingImage}
                    className="w-full h-40"
                    key={"trending-" + imageIndex} 
                  />
                )) }
                
              </div>
              <img
                src={artData.trendingCollections[0].avatarPath}
                className="w-24 h-24 rounded-full absolute border-4 border-white"
                style={{ left: "calc(50% - 3rem)", top: "calc(50% - 3rem)" }}
              ></img>
              <div
                className="absolute bottom-0 w-full text-center font-bold text-white text-2xl py-2 bg-gradient-to-t from-black to-transparent"
                style={{ top: "calc(50% + 4rem)" }}
              >
                <div className="w-full">{artData.trendingCollections[0].name}</div>
                <div className="w-full text-xl">{artData.trendingCollections[0].galleryName}</div>
              </div>
            </div>
          </Link>
      } 
      {artData.trendingCollections[1] == null ? <Link key={"trending-" + 1}  style={blankStyle}><div className="relative rounded-md overflow-hidden"></div></Link> :
         <Link key={"trending-" + 1} to={`/collections/${1}`}>
            <div className="relative rounded-md overflow-hidden">
              <div className="grid grid-cols-2 grid-rows-2">
                { artData.trendingCollections[1].images.map((trendingImage, imageIndex) => (
                  <img
                    src={trendingImage}
                    className="w-full h-40"
                    key={"trending-" + imageIndex} 
                  />
                )) }
                
              </div>
              <img
                src={artData.trendingCollections[1].avatarPath}
                className="w-24 h-24 rounded-full absolute border-4 border-white"
                style={{ left: "calc(50% - 3rem)", top: "calc(50% - 3rem)" }}
              ></img>
              <div
                className="absolute bottom-0 w-full text-center font-bold text-white text-2xl py-2 bg-gradient-to-t from-black to-transparent"
                style={{ top: "calc(50% + 4rem)" }}
              >
                <div className="w-full">{artData.trendingCollections[1].name}</div>
                <div className="w-full text-xl">{artData.trendingCollections[1].galleryName}</div>
              </div>
            </div>
          </Link>
      }
      {artData.trendingCollections[2] == null ? <Link key={"trending-" + 2}  style={blankStyle}><div className="relative rounded-md overflow-hidden"></div></Link> :
         <Link key={"trending-" + 2} to={`/collections/${2}`}>
            <div className="relative rounded-md overflow-hidden">
              <div className="grid grid-cols-2 grid-rows-2">
                { artData.trendingCollections[2].images.map((trendingImage, imageIndex) => (
                  <img
                    src={trendingImage}
                    className="w-full h-40"
                    key={"trending-" + imageIndex} 
                  />
                )) }
                
              </div>
              <img
                src={artData.trendingCollections[2].avatarPath}
                className="w-24 h-24 rounded-full absolute border-4 border-white"
                style={{ left: "calc(50% - 3rem)", top: "calc(50% - 3rem)" }}
              ></img>
              <div
                className="absolute bottom-0 w-full text-center font-bold text-white text-2xl py-2 bg-gradient-to-t from-black to-transparent"
                style={{ top: "calc(50% + 4rem)" }}
              >
                <div className="w-full">{artData.trendingCollections[2].name}</div>
                <div className="w-full text-xl">{artData.trendingCollections[2].galleryName}</div>
              </div>
            </div>
          </Link>
      } 
      {artData.trendingCollections[3] == null ? <Link key={"trending-" + 3} style={blankStyle}><div className="relative rounded-md overflow-hidden"></div></Link> :
         <Link key={"trending-" + 3} to={`/collections/${3}`}>
            <div className="relative rounded-md overflow-hidden">
              <div className="grid grid-cols-2 grid-rows-2">
                { artData.trendingCollections[3].images.map((trendingImage, imageIndex) => (
                  <img
                    src={trendingImage}
                    className="w-full h-40"
                    key={"trending-" + imageIndex} 
                  />
                )) }
                
              </div>
              <img
                src={artData.trendingCollections[3].avatarPath}
                className="w-24 h-24 rounded-full absolute border-4 border-white"
                style={{ left: "calc(50% - 3rem)", top: "calc(50% - 3rem)" }}
              ></img>
              <div
                className="absolute bottom-0 w-full text-center font-bold text-white text-2xl py-2 bg-gradient-to-t from-black to-transparent"
                style={{ top: "calc(50% + 4rem)" }}
              >
                <div className="w-full">{artData.trendingCollections[3].name}</div>
                <div className="w-full text-xl">{artData.trendingCollections[3].galleryName}</div>
              </div>
            </div>
          </Link>
      } 
                   
      </div>
    </div>
  );
}
