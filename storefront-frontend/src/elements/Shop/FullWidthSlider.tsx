"use client"
import {Swiper, SwiperSlide } from "swiper/react"
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import IMAGES from "../../constant/theme";
import Image from "next/image";

export default function FullWidthSlider(){
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return(
        <>
            <Swiper className="product-gallery-swiper2" 
                spaceBetween= {0}
                updateOnWindowResize = {true}
                navigation = {{
                    nextEl: ".gallery-button-next",
                    prevEl: ".gallery-button-prev",
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]} 
            >                
                <SwiperSlide>
                    <Image src={IMAGES.Productdetail4png1} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.Productdetail4png2} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.Productdetail4png3} alt="product" />
                </SwiperSlide>               
            </Swiper>
            <Swiper className="product-gallery-swiper thumb-swiper-lg swiper-vertical"
                spaceBetween = {10}
				slidesPerView = {2}
				//freeMode: true,
				//watchSlidesProgress: true,
				pagination = {{
					el: ".swiper-pagination-trading",
				}}
                 // @ts-ignore
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
            >
                <SwiperSlide>
                    <Image src={IMAGES.ProductdetailThumbpng1} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.ProductdetailThumbpng2} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={IMAGES.ProductdetailThumbpng3} alt="product" />
                </SwiperSlide>                
            </Swiper>
        </>
    )
}