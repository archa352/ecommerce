"use client"
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import { tabList } from "@/constant/Alldata";
import IMAGES from "@/constant/theme";
import { useEffect, useRef, useState } from "react";

import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";
import Image, { StaticImageData } from "next/image";

interface CollageStyleType{
    image:string | StaticImageData;
    name: string;
    filter : string;
    category : string;
    coloumStyle : string;
}
const CollageStyleBlog : CollageStyleType[]= [
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Jacket Dresses', image : IMAGES.Portfolio3Pic1, name:'Cozy Knit Cardigan Sweater', category:"Sweater"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Outerwear Jacket Dresses', image : IMAGES.Portfolio3Pic2, name:'Plaid Wool Winter Coat', category:"Coat"},
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Formal-wear Dresses', image : IMAGES.Portfolio3Pic3, name:'Water-Resistant Windbreaker Jacket', category:"Jacket"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Tops', image : IMAGES.Portfolio3Pic4, name:'Comfy Lounge Jogger Pants', category:"Pants"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Jacket', image : IMAGES.Portfolio3Pic5, name:'Rustic Charm Meets Functionality With Wood', category:"Bowl"},    
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Outerwear', image : IMAGES.Portfolio3Pic6, name:'Plaid Wool Winter Coat', category:"Coat"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Formal-wear Dresses', image : IMAGES.Portfolio3Pic7, name:'Suede Ankle Booties Collection', category:"Collection"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Tops', image : IMAGES.Portfolio3Pic8, name:'Vintage Denim Overalls Shorts', category:"Shorts"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Tops Formal-wear', image : IMAGES.Portfolio3Pic9, name:'Vintage Denim Overalls Shorts', category:"Shorts"},
    {coloumStyle: "col-xl-3 col-lg-3", filter : 'Tops Dresses Outerwear', image : IMAGES.Portfolio3Pic10, name:'Hiking Outdoor Gear Collection', category:"Collection"},
]

export default function CobbleStyleOne(){
    const [currentFilter, setCurrentFilter] = useState<string | undefined>("*");
    const isotopContainer = useRef<HTMLUListElement | null>(null);
    const isotopeInstance = useRef<Isotope | null>(null);

    // const initIsotope = () => {
    //     if (isotopContainer.current) {        
    //         isotopeInstance.current = new Isotope(isotopContainer.current, {
    //             itemSelector: ".card-container",
    //             layoutMode: "masonry",
    //         });
    //         imagesLoaded(isotopContainer.current).on("progress", () => {
    //             isotopeInstance.current?.layout();
    //         });
    //     }
    // };

    // const updateCategory = (val: string | undefined): void => {
    //     setCurrentFilter(val);        
    //     isotopeInstance.current?.arrange({
    //         filter: val,
    //     });
    // };

    // useEffect(() => {
    //     initIsotope();
    //     return () => {
    //         isotopeInstance.current?.destroy();
    //         isotopeInstance.current = null;
    //     };
    // }, []);

    useEffect(() => {
        let Isotope: any;
        let imagesLoaded: any;

        const initIsotope = async () => {
            const IsotopeModule = await import("isotope-layout");
            const imagesLoadedModule = await import("imagesloaded");

            Isotope = IsotopeModule.default;
            imagesLoaded = imagesLoadedModule.default;

            if (isotopContainer.current) {
                isotopeInstance.current = new Isotope(isotopContainer.current, {
                    itemSelector: ".card-container",
                    layoutMode: "masonry",
                });

                imagesLoaded(isotopContainer.current).on("progress", () => {
                    isotopeInstance.current?.layout();
                });
            }
        };

        initIsotope();

        return () => {
            isotopeInstance.current?.destroy();
            isotopeInstance.current = null;
        };
    }, []);

    const updateCategory = (val: string | undefined): void => {
        setCurrentFilter(val);
        isotopeInstance.current?.arrange({
            filter: val,
        });
    };

    return(
        <div className="page-content bg-light">
            <CommanBanner currentText="Cobble Style 1" parentText="Home" mainText="Cobble Style 1" image={IMAGES.BackBg1.src}/>
            <section className="content-inner pt-0 z-index-unset">
                <div className="site-filters style-2 clearfix center">
                    <ul className="filters" data-bs-toggle="buttons">
                        {tabList.map((item, ind)=>(
                            <li  data-filter={item.filter} className={`btn ${ currentFilter == item.filter ? "active" : ""}`} key={ind}
                                onClick={() => updateCategory(item.filter)}
                            >
                                <Link href={"#"}>{item.name}</Link> 
                            </li>
                        ))}    
                    </ul>
                </div>
                <div className="container">
				    <div className="clearfix">
                        <ul id="masonry" className="lightgallery row" data-masonry='{"percentPosition": true}'
                            ref={isotopContainer}
                        >
                            {CollageStyleBlog.map((elem, ind)=>(
                                <li className={`card-container col-md-6 m-b30 All ${elem.coloumStyle} ${elem.filter}`} key={ind}>
                                    <div className="portfolio-box style-2">
                                        <div className="dz-media">
                                            <Link href="/portfolio-details-1">
                                                <Image src={elem.image} alt="/" />
                                            </Link>
                                        </div>
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-secondary">{elem.category}</span>
                                                </Link>	
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-1">{elem.name}</Link></h4>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>    
                    </div>
                </div>
            </section>
        </div>
    )
}