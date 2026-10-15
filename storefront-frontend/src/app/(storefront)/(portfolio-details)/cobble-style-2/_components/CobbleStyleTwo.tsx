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
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Tops Outerwear', image : IMAGES.Portfolio6DetailPic1, name:'Satin Wrap Party Blouse', category:"Party Blouse"},
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Jacket', image : IMAGES.Portfolio6DetailPic2, name:'Hiking Outdoor Gear Collection', category:"Gear Collection"},
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Formal-wear Tops Jacket', image : IMAGES.Portfolio6DetailPic3, name:'Sophisticated Swagger Suit', category:"Suit"},
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Tops Dresses Outerwear', image : IMAGES.Portfolio6DetailPic4, name:'Vintage Denim Overalls Shorts', category:"Shorts"},
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Jacket Formal-wear', image : IMAGES.Portfolio6DetailPic5, name:'Stylish Fedora Hat Collection', category:"Stylish"},    
    {coloumStyle: "col-xl-6 col-lg-6", filter : 'Formal-wear Dresses Outerwear', image : IMAGES.Portfolio6DetailPic6, name:'Plaid Wool Winter Coat', category:"Winter Coat"},
]

export default function CobbleStyleTwo(){
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
            <CommanBanner currentText="Cobble Style 2" parentText="Home" mainText="Cobble Style 2" image={IMAGES.BackBg1.src}/>
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
                                    <div className="portfolio-box style-1">
                                        <div className="dz-media">
                                            <Link href="/portfolio-details-1">
                                                <Image src={elem.image} alt="/" />
                                            </Link>
                                        </div>
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">{elem.category}</span>
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