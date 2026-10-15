"use client"
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from "next/link";
import { Autoplay } from 'swiper/modules';
import { HottestSliderBlogData } from '../../constant/Alldata';
import Image from 'next/image';


const HottestSliderBlog = () => {
    return (
        <Swiper 
            speed = {1000}
            loop = {true}
            parallax = { true}
            slidesPerView = {4}
            spaceBetween = {30}
            autoplay = {{
                delay: 2500,
            }}      
            watchSlidesProgress={true}
            modules = {[Autoplay]}         
            breakpoints = {{
                1600: {
                    slidesPerView: 4,
                },
                1440: {
                    slidesPerView: 3,
                },
                1300: {
                    slidesPerView: 5,
                },
                991: {
                    slidesPerView: 4,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 2,
                },
                340: {
                    slidesPerView: 1,
                    centeredSlides: true,
                },
            }}
            className="swiper swiper-shop2 swiper-visible"
        >     
            {HottestSliderBlogData.map((item, i)=>(
                <SwiperSlide key={i}>
                    <div className="shop-card style-7 ">
                        <div className="dz-media">
                            <Image src={item.image} alt="product" />
                        </div>
                        <div className="dz-content">
                            <h5 className="title"><Link href="/shop-list">{item.title}</Link></h5>
                            <span className="sale-title text-success">up to 79% off</span>
                        </div>
                    </div>
                </SwiperSlide>
            ))}                            
        </Swiper>
    );
};

export default HottestSliderBlog;