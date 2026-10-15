"use client"
import {Swiper, SwiperSlide } from "swiper/react";
import { ShopCatSlider } from "../../constant/Alldata";
import Link from "next/link";
import Image from "next/image";


export default function ShopCategorySlider(){
    return(
        <Swiper className="category-swiper"
            slidesPerView={7}            
            centeredSlides= {false}
            spaceBetween = {20}
            loop= {true}            
            autoplay= {{
                delay: 3000,
            }}            
            breakpoints = {{
                1600: {
                    slidesPerView: 7,
                },
                1200: {
                    slidesPerView: 5,
                },
                991: {
                    slidesPerView: 4,
                },
                591: {
                    slidesPerView: 3, 	
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
                        <div className="dz-media rounded">
                            <Image src={elem.image} alt="cat" />
                        </div>
                        <div className="dz-content">
                            <h6 className="title"><Link href="/shop-list">{elem.name}</Link></h6>
                        </div>
                    </div>
                </SwiperSlide>
            ))}            
        </Swiper> 
    )
}