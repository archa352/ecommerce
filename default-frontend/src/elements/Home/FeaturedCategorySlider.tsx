"use client"

import Link from "next/link";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FeaturedSliderData } from '../../constant/Alldata';
import Image from "next/image";

const FeaturedCategorySlider = () => {
    return (
        <Swiper 
            slidesPerView = {5}
            spaceBetween = {15}
            loop = {true}                       
            navigation = {{
                nextEl: ".shop-button-next",
                prevEl: ".shop-button-prev",
            }}
            className="swiper-shop"
            modules={[Navigation]}
            breakpoints= {{
                1600: {
                    slidesPerView: 5,
                },
                1400: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 3,
                },
                575: {
                    slidesPerView: 2,
                },
                340: {
                    slidesPerView: 2,
                },
            }}
        >
            {FeaturedSliderData.map(({image, name}, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="shop-box style-1 wow fadeInUp" data-wow-delay="0.2s">
                        <div className="dz-media">
                            <Image src={image} alt="dz" />
                        </div>
                        <h6 className="product-name"><Link href="/shop-with-category">{name}</Link></h6>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FeaturedCategorySlider;