"use client"

import {Swiper, SwiperSlide } from "swiper/react";
import { SponsoredSliderData } from "../../constant/Alldata";
import Image from "next/image";

const SponsoredSlider = () => {
    return (
        <Swiper 
            slidesPerView = {4}
            spaceBetween = {30}
            loop = {true}            
            breakpoints= {{
                1200: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1.5,
                },
                340: {
                    slidesPerView: 1,
                    centeredSlides: true,
                },
            }}
            className="swiper swiper-company"
        >            
            {SponsoredSliderData.map((item, i)=>(
                <SwiperSlide key={i}>
                    <div className="company-box style-1">
                        <div className="dz-media">
                            <Image src={item.image} alt="media" 
                                 className="company-img" 
                            />
                            <Image src={item.image2} alt="media1" 
                                className="logo" 
                            />
                            {item.store === "store" ? 
                                <span className="sale-badge">in Store</span>
                                :
                                ''
                            }
                        </div>
                        <div className="dz-content">
                            <h6 className="title">{item.title}</h6>
                            <span className="sale-title">Min. 30% Off</span>
                        </div>		
                    </div>
                </SwiperSlide>
            ))}                
        </Swiper>
    );
};

export default SponsoredSlider;