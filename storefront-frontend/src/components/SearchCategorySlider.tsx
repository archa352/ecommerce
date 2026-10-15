"use client"

import {Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { ShopCatSlider } from "../constant/Alldata";
import Image from "next/image";

export default function SearchCategorySlider(){
    return(
        <Swiper className="category-swiper2"
            slidesPerView={6}            
            centeredSlides= {false}
            spaceBetween = {20}
            loop= {true}            
            autoplay= {{
                delay: 3000,
            }}            
            breakpoints = {{
                1600: {
                    slidesPerView: 6,
                    spaceBetween: 40,
                },
                1200: {
                    slidesPerView: 6,
                    spaceBetween: 20,
                },
                991: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                591: {
                    slidesPerView: 3, 	
                    spaceBetween: 15,
                },
                320: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
            }}

        >           
            {ShopCatSlider.map((elem, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="shop-card">
                        <div className="dz-media">
                            <Image src={elem.image} alt="cat" />
                        </div>
                        <div className="dz-content">
                            <h6 className="title"><Link href="/shop-list">{elem.name}</Link></h6>
                            <h6 className="price">$40.00</h6>
                        </div>
                    </div>
                </SwiperSlide>
            ))}            
        </Swiper>
    )
}