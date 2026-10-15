"use client"
import { Autoplay } from "swiper/modules";
import {Swiper, SwiperSlide } from "swiper/react";
import IMAGES from "../../constant/theme";
import Link from "next/link";

const OffersectionSlider = () => {
    return (
        <Swiper
            speed = {1000}
            loop = {true}
            parallax = {true}
            slidesPerView = {3}
            spaceBetween = {15}
            // watchSlidesProgress={true}
            autoplay ={{
                delay: 2500,
            }}
            breakpoints = {{
                1400: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 2,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 1.5,
                },
                600: {
                    slidesPerView: 1,
                },
                575: {
                    slidesPerView: 1,
                },
                340: {
                    slidesPerView: 1,
                    centeredSlides: true,
                },
            }}
            modules={[Autoplay]}            
            className="swiper-product"
        >
            <div className="swiper-wrapper product-style2">               
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="0.4s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng1.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">20% Off</span>
                                <h2 className="product-name">Luxury Bras</h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>                
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="0.6s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng2.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">Sale Up to 50% Off</span>
                                <h2 className="sub-title1">Summer <span className="year">2024</span></h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="0.8s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng3.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">20% Off</span>
                                <h2 className="sub-title2">Swimwear<span className="bg-title">Sale</span></h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="1.0s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng1.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">20% Off</span>
                                <h2 className="product-name">Luxury Bras</h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="1.2s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng2.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">Sale Up to 50% Off</span>
                                <h2 className="sub-title1">Summer <span className="year">2024</span></h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="product-box style-2 wow fadeInUp" data-wow-delay="1.4s">
                        <div className="product-media" style={{backgroundImage: `url(${IMAGES.ClothesPng3.src})`}}></div>
                        <div className="product-content">
                            <div className="main-content">
                                <span className="offer">20% Off</span>
                                <h2 className="sub-title2">Swimwear<span className="bg-title">Sale</span></h2>
                                <Link href="/shop-list" className="btn btn-outline-secondary btn-rounded btn-lg">Collect Now</Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </div>
        </Swiper>
    );
};

export default OffersectionSlider;