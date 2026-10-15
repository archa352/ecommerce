"use client"
import {Swiper, SwiperSlide } from "swiper/react"
import IMAGES from "@/constant/theme"
import Link from "next/link";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";

const thumbsliderData = [
    {image: IMAGES.Portfolio7Pic1, name:'Elevate your style with our exclusive shirt collection.', category:"collection"},
    {image: IMAGES.Portfolio7Pic2, name:'Unleash your confidence in fashionable, tailored shirts.', category:"shirts"},
    {image: IMAGES.Portfolio7Pic3, name:'Embrace comfort without compromising on a sharp look.', category:"comfort"},
    {image: IMAGES.Portfolio7Pic4, name:'Explore a blend of modern and classic shirt designs.', category:"designs"},
    {image: IMAGES.Portfolio7Pic5, name:'Each shirt is a statement of individuality and sophistication.', category:"shirt"},
    {image: IMAGES.Portfolio7Pic6, name:'Immerse yourself in quality fabrics and impeccable craftsmanship.', category:"craftsmanship"},
    {image: IMAGES.Portfolio7Pic7, name:'Redefine elegance with our curated shirt fashion line.', category:"fashion"},
    {image: IMAGES.Portfolio7Pic8, name:'Effortlessly transition from day to night in our versatile shirts.', category:"shirts"}
];

export default function PortfolioThumbsSlider(){
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return(
        <div className="page-content bg-ligh">
            <section className="portfoilo-wrapper-1 z-index-unset bg-white">
                <div className="container-fluid px-0">
                    <div className="row gx-0">
                        <div className="col-xl-5 col-lg-6 col-md-7">
                            <Swiper  className="swiper portfolio-gallery swiper-gl"
                                slidesPerView = {1}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Thumbs]} 
                            >
                                {thumbsliderData.map((item, i)=>(
                                    <SwiperSlide key={i}>
                                        <div className="portfolio-box style-2 rounded-0">
                                            <div className="dz-media">
                                                <Link href="/portfolio-details-1">
                                                    <Image src={item.image} className="swiper-gl-image" alt="/" />
                                                </Link>
                                            </div>
                                            <div className="dz-content w-100">
                                                <div className="product-tag">
                                                    <Link href="/portfolio-details-1">
                                                        <span className="badge badge-secondary">{item.category}</span>
                                                    </Link>
                                                </div>
                                                <h4 className="title"><Link href="/portfolio-details-3">{item.name}</Link></h4>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}                                
                            </Swiper>
                        </div>
                        <div className="col-xl-7 col-lg-6 col-md-5 gallary-list">
                            <Swiper className="swiper portfolio-thumb"
                                slidesPerView= "auto"
                                spaceBetween = {0}
                                // @ts-ignore
                                onSwiper={setThumbsSwiper}
                                modules={[Thumbs]}
                            >
                                <div className="swiper-wrapper row gx-0 masonry" data-masonry='{"percentPosition": true }'>
                                    {thumbsliderData.map((item, ind)=>(
                                        <SwiperSlide key={ind}>
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">
                                                        <Image src={item.image} className="swiper-gl-image" alt="/" />
                                                    </Link>
                                                </div>
                                                <div className="dz-content w-100">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-secondary">{item.category}</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-3">{item.name}</Link></h4>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}                                    
                                </div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}