"use client"
import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import HottestSliderBlog from "./HottestSliderBlog";
import Image from "next/image";
import { useEffect } from "react";

const hottestBlogMap = [
    {image: IMAGES.productmedium3, title:'Cozy Knit Cardigan Sweater', design:'area-box1'},
    {image: IMAGES.productmedium4, title:'Sophisticated Swagger Suit', design:'area-box2'},
    {image: IMAGES.productmedium5, title:'Classic Denim Skinny Jeans', design:'area-box3'},
];

const HottestBlog = () => {
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const mappingSection = document.getElementById('Maping');
    //         const mapLine = document.getElementById('map-line');
    //         // console.log(mappingSection,"mapping");
    //         // console.log(mapLine,"mapLine---");
                
    //         if (mappingSection && mapLine) {
    //             const rect = mappingSection.getBoundingClientRect();
    //             const windowHeight = window.innerHeight;

    //             if (rect.top >= 0 && rect.bottom <= windowHeight) {
    //             const scrollPercentage = ((rect.bottom - windowHeight) / (rect.height - windowHeight)) * 100;
    //             const clampedPercentage = Math.min(100, Math.max(0, scrollPercentage));
    //             mapLine.style.height = clampedPercentage.toFixed() + '%';
    //             }
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);
    return (      
        <div className="row align-items-start">
            <div className="col-xl-7 col-lg-12 col-md-12">
                <div className="map-area" >
                    <Image src={IMAGES.map2} alt="product" />
                    <div className="map-line" id="map-line"  style={{ height: '100%' }}>
                        <Image src={IMAGES.mapline} alt="product" />
                    </div>
                    <div className="loction-b" dangerouslySetInnerHTML={{__html : SVGICON.locationSvgB}}></div>
                    <div className="loction-center" dangerouslySetInnerHTML={{__html : SVGICON.KiloMeterSvg}} ></div>
                    <div className="loction-a" dangerouslySetInnerHTML={{__html : SVGICON.locationSvgA}}></div>
                    {hottestBlogMap.map((item, i)=>(
                        <div className={`animated ${item.design}`} key={i}>
                            <div className="shop-card style-7">
                                <div className="dz-media">
                                    <Image src={item.image} alt="product" />
                                </div>
                                <div className="dz-content">
                                    <h5 className="title"><Link href="/shop-list">{item.title}</Link></h5>
                                    <span className="sale-title">up to 79% off</span>
                                </div>
                            </div>	
                        </div>	
                    ))}                   
                </div>
            </div>	
            <div className="col-xl-5 col-lg-12 col-md-12 custom-width">
                <div className="section-head style-1 d-lg-flex align-items-end justify-content-between">
                    <div className="left-content">
                        <h2 className="title">Discovering the Hottest Nearby Destinations in Your Area</h2>
                        <p className="text-capitalize text-secondary m-0">Up to 60% off + up to $107 cashBACK</p>
                    </div>
                    <Link href="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1 m-b15">See All 
                        <i className="icon feather icon-chevron-right font-18" />
                    </Link>			
                </div>
                <HottestSliderBlog />
            </div>
        </div>				
    );
};

export default HottestBlog;