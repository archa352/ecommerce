"use client"
import {Swiper, SwiperSlide } from "swiper/react";
import IMAGES from "../../constant/theme";
import { Pagination } from "swiper/modules";
import Image from "next/image";

export default function PostSlider(){
    return(
        <Swiper className="blog-slideshow rounded"            
            loop = {true}
            spaceBetween = {0}
            slidesPerView = "auto"
            speed = {1500}            
            pagination = {{
                el: ".swiper-pagination-two",
                clickable: true,
            }}
            modules={[Pagination]}
        >
           
            <SwiperSlide>
                <Image src={IMAGES.BlogDetailPic4} alt="/" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={IMAGES.BlogDetailPic5} alt="/" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src={IMAGES.BlogDetailPic6} alt="/" />
            </SwiperSlide>
            
            <div className="swiper-pagination-two style-2"></div>
        </Swiper>
    )
}