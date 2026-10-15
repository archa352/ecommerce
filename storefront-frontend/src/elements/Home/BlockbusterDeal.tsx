"use client"
import {Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { BlockbusterSliderData } from "../../constant/Alldata";
import Link from "next/link";
import Image from "next/image";

const BlockbusterDeal = () => {
    return (
        <Swiper
            speed = {1000}
            loop = {true}
            parallax = {true}
            slidesPerView = {4}
            spaceBetween = {30}
            watchSlidesProgress={true}
            autoplay ={{
                delay: 2500,
            }}
            modules={[Autoplay]}
            className="swiper-four swiper-visible"
            breakpoints = {{
                1200: {
                    slidesPerView: 4,
                },
                1024: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                591: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                340: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                },
            }}
        >
            {BlockbusterSliderData.map((item, i)=>(
                <SwiperSlide key={i}>
                    <div className="shop-card style-2">
                        <div className="dz-media about-img">
                            <Image src={item.image} alt="media"/>
                        </div>
                        <div className="dz-content">
                            <div>
                                <span className="sale-title">up to 79% off</span>
                                <h5 className="title"><Link href="/shop-list">{item.title}</Link></h5>
                            </div>
                            <h6 className="price">
                                $80
                                <del>$95</del>
                            </h6>
                        </div>
                    </div>
                </SwiperSlide>
            ))}               
        </Swiper>
    );
};

export default BlockbusterDeal;