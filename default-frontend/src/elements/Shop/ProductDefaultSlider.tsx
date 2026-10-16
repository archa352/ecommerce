"use client"
import Link from "next/link";
import IMAGES from "../../constant/theme";
import { Swiper,SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Image from "next/image";

export default function ProductDefaultSlider(){
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return(
        <div className="swiper-btn-center-lr">
            <LightGallery 
                plugins={[lgThumbnail, lgZoom]}
                selector={'.DZoomImage'}
            >
                <Swiper className="product-gallery-swiper2 rounded"
                    spaceBetween= {0}
                    updateOnWindowResize = {true}                
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Thumbs]}
                >                
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productdetail2png1.src} data-src={IMAGES.productdetail2png1.src}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <Image src={IMAGES.productdetail2png1} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productdetail2png1} alt="product1" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productdetail2png2.src} data-src={IMAGES.productdetail2png2.src}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <Image src={IMAGES.productdetail2png2} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productdetail2png2} alt="product2" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" href={IMAGES.productdetail2png3.src} data-src={IMAGES.productdetail2png3.src}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <Image src={IMAGES.productdetail2png3} alt="" className=" d-none"/> 
                            </Link>
                            <Image src={IMAGES.productdetail2png3} alt="product3" />
                        </div>
                    </SwiperSlide>
                    
                </Swiper>
            </LightGallery>
            <Swiper className="product-gallery-swiper thumb-swiper-lg"
                spaceBetween= {10}                
				slidesPerView = {2}
				//freeMode: true,
				//watchSlidesProgress: true,
                // @ts-ignore
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
				
            >                
                <SwiperSlide>
                    <Image src={IMAGES.productdetail2thumbpng1} alt="product1" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.productdetail2thumbpng2} alt="product2" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.productdetail2thumbpng3} alt="product3" />
                </SwiperSlide>                
            </Swiper>
        </div>	
    )
}