"use client"
import { useEffect, useRef, useState } from "react";
import  Link  from "next/link";
import CommanBanner from "@/components/CommanBanner";
import { tabList } from "@/constant/Alldata";
import IMAGES from "@/constant/theme";
import Isotope from "isotope-layout";
// import imagesLoaded from "imagesloaded";
import Image, { StaticImageData } from "next/image";

interface CollageStyleType{
    image:string | StaticImageData;
    name: string;
    filter : string;
    category : string;
    coloumStyle : string;
}
const CollageStyleBlog : CollageStyleType[]= [
    {coloumStyle: "col-xl-4", filter : 'Formal-wear Tops', image : IMAGES.Portfolio5Pic1, name:'Athletic Mesh Sports Leggings', category:"Leggings"},
    {coloumStyle: "col-xl-4", filter : 'Formal-wear Outerwear Dresses', image : IMAGES.Portfolio5Pic2, name:'Water-Resistant Windbreaker Jacket', category:"Jacket"},
    {coloumStyle: "col-xl-4", filter : 'Tops Jacket', image : IMAGES.Portfolio5Pic3, name:'Classic Denim Skinny Jeans', category:"Jeans"},
    {coloumStyle: "col-xl-4", filter : 'Tops Jacket Outerwear', image : IMAGES.Portfolio5Pic4, name:'Stylish Fedora Hat Collection', category:"Collection"},
    {coloumStyle: "col-xl-4", filter : 'Tops Formal-wear', image : IMAGES.Portfolio5Pic5, name:'Plaid Wool Winter Coat', category:"Winter"},    
    {coloumStyle: "col-xl-4", filter : 'Outerwear Formal-wear', image : IMAGES.Portfolio5Pic6, name:'Suede Ankle Booties Collection', category:"Collection"},
]

export default function MasonryGrid(){
    const [currentFilter, setCurrentFilter] = useState<string | undefined>("*");
    const isotopContainer = useRef<HTMLUListElement | null>(null);
    const isotopeInstance = useRef<Isotope | null>(null);

   
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
                <CommanBanner currentText="Collage Style 2" parentText="Home" mainText="Collage Style 2" image={IMAGES.BackBg1.src}/>
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
        </>
    )
}