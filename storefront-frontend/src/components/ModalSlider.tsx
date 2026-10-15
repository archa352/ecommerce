"use client"
import {Swiper, SwiperSlide } from "swiper/react";
import IMAGES from "../constant/theme";
import { FreeMode, Thumbs } from "swiper/modules";
import { useState } from "react";
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Link from "next/link";
import Image from "next/image";

const sliderData = [
    { image: IMAGES.productlady1},
    { image: IMAGES.productlady2},    
    { image: IMAGES.productlady3},
];


export default function ModalSlider(){
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    function hoverEffect(e: any) {
        const targetRect = e.target.getBoundingClientRect();
        
        let xValue = ((e.clientX - targetRect.left) / targetRect.width) * 50;
        let yValue = ((e.clientY - targetRect.top) / targetRect.height) * 50;
        
        e.target.setAttribute("style", `cursor: pointer; transition: 0.1s; transform: scale(1.5); transform-origin: ${xValue}% ${yValue}%`);
    }
    function removeHover(e: any) {
        e.target.setAttribute("style", `cursor: pointer; transition: 0.1s; transform: scale(1); transform-origin: 0% 0%`);
    }
    return(
        <>
            <LightGallery 
                plugins={[lgThumbnail, lgZoom]}
                selector={'.DZoomImage'}
            >
                <Swiper className="quick-modal-swiper2"
                    spaceBetween = {0}
                    updateOnWindowResize = {true}	                
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Thumbs]} 

                >                
                    {sliderData.map((item, ind)=>(
                        <SwiperSlide id="lightgallery" key={ind}>
                            <div className="dz-media">
                                <Link className="mfp-link lg-item DZoomImage" href={item.image.src} data-src={item.image.src}>
                                    <i className="feather icon-maximize dz-maximize top-right z-1"/>
                                    <Image src={item.image} alt="" className=" d-none"/> 
                                </Link>
                                <Image src={item.image} alt="slider"                                  
                                    onMouseEnter={hoverEffect}
                                    onMouseLeave={removeHover}
                                />
                            </div>
                        </SwiperSlide>
                    ))}                    
                </Swiper>
            </LightGallery>
            <Swiper className="quick-modal-swiper thumb-swiper-lg thumb-sm swiper-vertical"
                spaceBetween = {15}
                slidesPerView = {4}
                freeMode = {true}
                watchSlidesProgress = {true}
                // @ts-ignore
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                
            >
                <SwiperSlide>
                    <Image src={IMAGES.thumbproductlady1} alt="thumb1"/>
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.thumbproductlady2} alt="thumb1"/>
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.thumbproductlady3} alt="thumb1"/>
                </SwiperSlide>
               
            </Swiper>
        </>
    )
}