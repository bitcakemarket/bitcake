import React from 'react'
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom';
import ScaleLoader from "react-spinners/ScaleLoader";

// subMenu: [
//     {
//         value: 'All NFTs',
//         link: '/collections',
//         svgPath: '/assets/icons/nav/all.png'
//     },
// ]

export default function SubCategory(props) {

    const { items } = props;
    return (
        <ul
            className="sub-cateogry-menu list-unstyled"
        >
            {
                items.map((item, index) => {
                    return (
                        <li className="sub-category-item" key={index} onClick={() => {
                        }}>
                            <Link to={item.link} key={index} className="bg-red">
                                <div className="text-left p-3 font-medium flex items-center hover:bg-blue-50 hover:shadow-md border-b border-primary-light bg-white z-50">
                                    {item.svgPath && (
                                        <img
                                            alt="MenuImage"
                                            src={item.svgPath}
                                            className="w-6 h-6"
                                        ></img>
                                    )}
                                    <span className="ml-3">{item.value}</span>
                                </div>
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    );
}
