"use client"
import {Swiper, SwiperSlide } from "swiper/react";
import IMAGES from "../../constant/theme";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function StatusSlider(){
    return(
        <Swiper className="status-swiper swiper"
            loop = {true}
            spaceBetween = {0}
            slidesPerView = "auto"
            speed = {1500}
            effect = "fade"
            autoplay = {{
                delay: 2000,
            }}
            pagination = {{
                el: ".status-pagination",
                clickable: true,
            }}
            modules={[Pagination, 
                Autoplay
            ]}
        >
            <div className="swiper-wrapper">
                <SwiperSlide>
                    <div className="status-top-box">	
                        <div className="status-content">
                            <span className="post-date">24 Oct 2024</span>
                            <h4 className="title">Everything You Need to Know About Cultural</h4>
                        </div>
                        <div className="status-btn">
                            <Link href="#" className="btn btn-white btn-sm btnhover20" >Read Post</Link>
                        </div>
                    </div>
                    <Image src={IMAGES.BlogPost3Pic1} alt="post" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <div className="status-top-box">	
                        <div className="status-content">
                            <span className="post-date">24 Oct 2024</span>
                            <h4 className="title">Everything You Need to Know About Cultural</h4>
                        </div>
                        <div className="status-btn">
                            <Link href="#" className="btn btn-white btn-sm btnhover20">Read Post</Link>
                        </div>
                    </div>
                    <video autoPlay loop muted>
                        <source src={IMAGES.StroiesMp4} type="video/mp4" />
                    </video>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <div className="status-top-box">	
                        <div className="status-content">
                            <span className="post-date">24 Oct 2024</span>
                            <h4 className="title">Everything You Need to Know About Cultural</h4>
                        </div>
                        <div className="status-btn">
                            <Link href="#" className="btn btn-white btn-sm btnhover20" >Read Post</Link>
                        </div>
                    </div>
                    <Image src={IMAGES.BlogPost1Pic2} alt="blog" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <div className="status-top-box">	
                        <div className="status-content">
                            <span className="post-date">24 Oct 2024</span>
                            <h4 className="title">Everything You Need to Know About Cultural</h4>
                        </div>
                        <div className="status-btn">
                            <Link className="btn btn-white btn-sm btnhover20" href="#">Read Post</Link>
                        </div>
                    </div>
                    <Image src={IMAGES.BlogPost1Pic6} alt="blog" />
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                    <div className="status-top-box">	
                        <div className="status-content">
                            <span className="post-date">24 Oct 2024</span>
                            <h4 className="title">Everything You Need to Know About Cultural</h4>
                        </div>
                        <div className="status-btn">
                            <Link className="btn btn-white btn-sm btnhover20" href={"#"}>Read Post</Link>
                        </div>
                    </div>
                    <Image src={IMAGES.BlogPost1Pic3} alt="post" />
                </SwiperSlide>
            </div>
        </Swiper> 
    )
}