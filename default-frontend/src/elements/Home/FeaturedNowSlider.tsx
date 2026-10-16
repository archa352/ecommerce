import { Autoplay } from "swiper/modules";
import {Swiper, SwiperSlide } from "swiper/react";
import { FeaturedNowSliderData } from "../../constant/Alldata";
import Link from "next/link";
import Image from "next/image";



const FeaturedNowSlider = () => {
    return (
        <Swiper 
            speed = {1000}
            loop = {true}
            parallax = {true}
            slidesPerView = {3}
            spaceBetween = {30}
            watchSlidesProgress={true}   
            autoplay = {{
                delay: 2500,
            }}
            modules={[Autoplay]}
            breakpoints={{
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
            className="swiper swiper-product2 swiper-visible"
        >
            {FeaturedNowSliderData.map((item, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="shop-card style-4">
                        <div className="dz-media">
                            <Image src={item.image} alt="image" />
                        </div>
                        <div className="dz-content">
                            <div>
                                <h6 className="title"><Link href="/shop-list">{item.name}</Link></h6>
                                <span className="sale-title">Up to 40% Off</span>
                            </div>
                            <div className="d-flex align-items-center"> 
                                <h6 className="price">$80<del>$95</del></h6>
                                <span className="review"><i className="fa-solid fa-star" />(2k Review)</span>
                            </div>	
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FeaturedNowSlider;