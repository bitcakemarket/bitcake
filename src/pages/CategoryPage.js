import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NFTCard from "../components/common/NFTCard";
import { sportData, artData, videoData, audioData } from "../constants/category";

import { useParams } from "react-router";



export default function CategoryPage() {

  const [data, setData] = useState(sportData)
  const id = useParams().id

  useEffect(() => {
    switch (id) {
      case "Sports":
        setData(sportData);
        break
      case "Art":
        setData(artData);
        break
      case "Podcasts":
        break;
      case "Radio":
        break;
      case "Gaming":
        break;
      case "Politics":
        break;
      case "Education":
        break;
      case "Film":
        setData(videoData);
        break;
      case "Entertainment":
        break;
      case "Other":
        break;


    }

  }, [id]);
  return (
    <div className=" w-full pt-60 pb-20 text-center lg:text-left flex flex-wrap">
      <div className="absolute left-0 top-0 w-screen h-60">
        <img
          alt=""
          src={data.brandImage}
          className="w-full h-full border border-gray-200 object-cover"
        />
      </div>

      <div className="text-center w-full text-4xl font-medium mt-8">
        {data.title}
      </div>

      <div
        className="text-center w-full text-sm text-gray-500 max-w-3xl mx-auto mt-8"
        dangerouslySetInnerHTML={{ __html: data.description }}
      ></div>

      <div className="w-full mt-16">
        <div className="w-full flex justify-between items-end border-b border-gray-400 pb-2 mt-16">
          <div className="text-xl font-hakuna text-gray-700">
            ENDING SOON
          </div>
          <Link to={``} className="flex items-center cursor-pointer">
            <div className="text-md font-hakuna text-gray-500 cursor-pointer">
              View all
            </div>
          </Link>
        </div>
        <div className="w-full mt-4">
          {
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              {data.endingSoon.map((recentItem, recentIndex) => {
                return (
                  <NFTCard
                    cardData={recentItem}
                    key={"recent-" + recentIndex}
                  />
                );
              })}
            </div>
          }
        </div>
        <div className="w-full flex justify-between items-end border-b border-gray-400 pb-2 mt-16">
          <div className="text-xl font-hakuna text-gray-700">
            NEWLY MINTED
          </div>
          <Link to={``} className="flex items-center cursor-pointer">
            <div className="text-md font-hakuna text-gray-500 cursor-pointer">
              View all
            </div>
          </Link>
        </div>
        <div className="w-full mt-4">
          {
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              {data.newlyMinted.map((newItem, newIndex) => {
                return <NFTCard cardData={newItem} key={"new-" + newIndex} />;
              })}
            </div>
          }
        </div>
        <div className="w-full flex justify-between items-end border-b border-gray-400 pb-2 mt-16">
          <div className="text-xl font-hakuna text-gray-700">
            ON AUCTION
          </div>
          <Link to={``} className="flex items-center cursor-pointer">
            <div className="text-md font-hakuna text-gray-500 cursor-pointer">
              View all
            </div>
          </Link>
        </div>
        <div className="w-full mt-4">
          {
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
              {data.onAuction.map((auctionItem, auctionIndex) => {
                return (
                  <NFTCard cardData={auctionItem} key={"new-" + auctionIndex} />
                );
              })}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
