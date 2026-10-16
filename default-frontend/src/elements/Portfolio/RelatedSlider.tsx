"use client"
import Link from "next/link";
import IMAGES from "../../constant/theme";
import {Swiper , SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image, { StaticImageData } from "next/image";

interface sliderDatatype {
    image : string | StaticImageData;
    name:  string;
    category : string;
}

const RelatedSliderData : sliderDatatype[] = [
    { image : IMAGES.PortfolioRelated1, name:'Cozy Knit Cardigan Sweater', category:"Top"},
    { image : IMAGES.PortfolioRelated2, name:'Sophisticated Swagger Suit', category:"Sweater"},
    { image : IMAGES.PortfolioRelated3, name:'Classic Denim Skinny Jeans', category:"Suit"},
    { image : IMAGES.PortfolioRelated4, name:'Athletic Mesh Sports Leggings', category:"Sweater"},
    { image : IMAGES.PortfolioRelated2, name:'Sophisticated Swagger Suit', category:"Topper"},
];
export default function RelatedSlider(){
    return(
        <Swiper className="swiper-four"
            slidesPerView={4}
            speed= {1000}
            loop= {true}
            parallax= {true}            
            spaceBetween = {30}
            autoplay={{
                delay: 2500,
            }}
            modules={[Autoplay]}
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
            {RelatedSliderData.map((elem, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="portfolio-box">
                        <div className="dz-media">
                            <Link href="/portfolio-details-1">
                                <Image src={elem.image} alt="port" />
                            </Link>	
                        </div>
                        <div className="dz-content">
                            <div className="product-tag">
                                <Link href="/portfolio-details-1">
                                    <span className="badge badge-primary">{elem.category}</span>
                                </Link>
                            </div>
                            <h5 className="title"><Link href="/portfolio-details-1">Cozy Knit Cardigan Sweater</Link></h5>
                        </div>
                    </div>
                </SwiperSlide>
            ))}                
           
        </Swiper>
    )
}
