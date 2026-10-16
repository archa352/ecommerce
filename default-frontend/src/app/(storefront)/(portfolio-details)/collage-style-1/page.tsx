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
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Tops ', image : IMAGES.Portfolio2DetailPic1, name:'Satin Wrap Party Blouse', category:"Party Blouse"},
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Outerwear Formal-wear', image : IMAGES.Portfolio2DetailPic2, name:'Plaid Wool Winter Coat', category:"Winter Coat"},
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Dresses', image : IMAGES.Portfolio2DetailPic3, name:'Hiking Outdoor Gear Collection', category:"Gear Collection"},
    {coloumStyle: "col-xl-8 col-lg-8", filter : 'Dresses Formal-wear', image : IMAGES.Portfolio2DetailPic4, name:'Sophisticated Swagger Suit', category:"Suit"},
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Tops Jacket', image : IMAGES.Portfolio2DetailPic5, name:'Vintage Denim Overalls Shorts', category:"Shorts"},
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Jacket', image : IMAGES.Portfolio2DetailPic6, name:'Stylish Fedora Hat Collection', category:"Stylish"},
    {coloumStyle: "col-xl-4 col-lg-4", filter : 'Outerwear', image : IMAGES.Portfolio2DetailPic7, name:'Plaid Wool Winter Coat', category:"Coat"},
]

export default function CollageStyleOne(){
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
        <>
            <div className="page-content bg-light">
                <CommanBanner currentText="Collage Style 1" parentText="Home" mainText="Collage Style 1" image={IMAGES.BackBg1.src}/>
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
        </>
    )
}