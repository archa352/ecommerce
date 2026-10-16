"use client"
import {Swiper, SwiperSlide} from "swiper/react";
import IMAGES from "../../constant/theme";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

interface SliderDatatype{
    image : string;
    name : string;
}

const TestimonialSliderData : SliderDatatype[] = [
    {image: IMAGES.ShopPorductPng1, name:'Woman Dress'},
    {image: IMAGES.ShopPorductPng2, name:'Kid Dress'},
    {image: IMAGES.ShopPorductPng3, name:'Woman Dress'},
    {image: IMAGES.ShopPorductPng4, name:'Woman Top'},
];

export default function SwiperTestimonial(){
    return(
        <>
            <Swiper className="testimonial-swiper about-swiper m-b30"
                speed = {1500}
                parallax = {true}
                slidesPerView = {3}
                navigation={{
                    nextEl: ".testimonial-button-next",
                    prevEl: ".testimonial-button-prev",
                }}
                spaceBetween= {30}
                loop={true}
                autoplay= {{
                   delay: 3000,
                }}
                pagination = {{
                    el: ".swiper-pagination",
                    clickable: true,
                    renderBullet: function (index, className) {
                      return '<span class="' + className + '">' +"0"+ (index + 1) + "</span>";
                    }
                }}
                modules={[Autoplay, Navigation, Pagination]}
                breakpoints={{
                    1600: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 2,
                    },
                    991: {
                        slidesPerView: 2,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    575: {
                        slidesPerView: 2,
                    },
                    360: {
                        slidesPerView: 1,
                    },
                }}
            >
                
                {TestimonialSliderData.map((item, ind)=>(
                    <SwiperSlide key={ind}>
                        <div className="about-box">	
                            <div className="about-img">
                                <Image src={item.image} alt="product" />
                            </div>
                            <div className="about-btn"><Link className="btn btn-white btn-md" href="/shop-list">{item.name}</Link></div>
                        </div>
                    </SwiperSlide>
                ))}                              
            </Swiper>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                    <div className="testimonial-button-prev c-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M36.8751 19.372H4.6659L12.288 11.9623C12.8705 11.3965 12.0066 10.4958 11.4164 11.0663C11.4164 11.0663 2.68932 19.5502 2.68932 19.5502C2.43467 19.7821 2.45495 20.2007 2.68935 20.4462C2.68932 20.4462 11.4164 28.9337 11.4164 28.9337C12.0038 29.4974 12.8725 28.6135 12.288 28.0377C12.288 28.0377 4.66308 20.622 4.66308 20.622H36.8751C37.6738 20.6144 37.7149 19.3872 36.8751 19.372Z" fill="black"/>
                        </svg>
                    </div>
                    <div className="testimonial-button-next c-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M3.12489 19.372H35.3341L27.712 11.9623C27.1295 11.3965 27.9934 10.4958 28.5836 11.0663L37.3107 19.5502C37.5653 19.7821 37.5451 20.2007 37.3107 20.4462L28.5836 28.9337C27.9962 29.4973 27.1275 28.6135 27.712 28.0377L35.3369 20.622H3.12489C2.32618 20.6144 2.28506 19.3872 3.12489 19.372Z" fill="black"/>
                        </svg>
                    </div>
                </div>	
                <div className="swiper-pagination style-1 text-end swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal">
                    <span className="swiper-pagination-bullet" tabIndex={0}>01</span>
                    <span className="swiper-pagination-bullet swiper-pagination-bullet-active" tabIndex={0}>02</span>
                    <span className="swiper-pagination-bullet" tabIndex={0}>03</span>
                </div>
            </div>
        </>
    )
}