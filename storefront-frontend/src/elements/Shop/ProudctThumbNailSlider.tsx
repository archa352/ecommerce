"use client"
import Link from "next/link";
import {Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import { useState } from "react";
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import IMAGES from "../../constant/theme";
import Image from "next/image";


export default function ProudctThumbNailSlider(){
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
                <Swiper className="product-gallery-swiper2"
                    spaceBetween = {0}
                    updateOnWindowResize = {true}	                
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Thumbs]} 

                >                
                    <SwiperSlide id="lightgallery">
                        <div className="dz-media rounded">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productlady1.src} data-src={IMAGES.productlady1.src}>
                                <i className="feather icon-maximize dz-maximize top-right z-1" />
                                <Image src={IMAGES.productlady1} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productlady1} alt="" 
                                onMouseEnter={hoverEffect}
                                onMouseLeave={removeHover}
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media rounded">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productlady2.src} data-src={IMAGES.productlady2.src}>
                                <i className="feather icon-maximize dz-maximize top-right z-1"/>
                                <Image src={IMAGES.productlady2} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productlady2} alt="" 
                                onMouseEnter={hoverEffect}
                                onMouseLeave={removeHover}
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media  rounded">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productlady3.src} data-src={IMAGES.productlady3.src}>
                                <i className="feather icon-maximize dz-maximize top-right z-1"/>
                                <Image src={IMAGES.productlady3} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productlady3} alt="" 
                                onMouseEnter={hoverEffect}
                                onMouseLeave={removeHover}
                            />
                        </div>
                    </SwiperSlide>                
                </Swiper>
                <Swiper className="product-gallery-swiper thumb-swiper-lg swiper-vertical"
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
            </LightGallery>
        </>
    )
}