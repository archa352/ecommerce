"use client"
import {Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import IMAGES from "@/constant/theme";
import Image, { StaticImageData } from "next/image";

interface SliderDatatype{
    image : string | StaticImageData;
    name : string;
} 
const SliderData : SliderDatatype[] = [
    { image : IMAGES.Portfolio8Pic1, name:"Unleash your confidence in fashionable, tailored shirts."},
    { image : IMAGES.Portfolio8Pic2, name:"Embrace comfort without compromising on a sharp look.t"},
    { image : IMAGES.Portfolio8Pic3, name:"Explore a blend of modern and classic shirt designs."},
    { image : IMAGES.Portfolio7Pic4, name:"Each shirt is a statement of individuality and sophistication."},
    { image : IMAGES.Portfolio7Pic5, name:"Explore a blend of modern and classic shirt designs."},
    
];

export default function PortfolioFilmStrip(){
    return(
        <>
            <div className="page-content bg-light">
                <section className="pt-0 z-index-unset bg-white overflow-hidden">
                    <div className="container-fluid">
                        <div className="d-sm-flex justify-content-sm-between justtify-content-center py-sm-3 py-3 mb-sm-0 m-b20">
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Portfolio Film Strip</li>
                                </ul>
                            </nav>
                            <div className="pagination-align style-2">
                                <div className="portfolio-button-prev swiper-button-prev">Prev </div>
                                <div className="portfolio-button-next swiper-button-next">Next</div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid pe-md-0">
                        <Swiper className="portfolio-gallery2"
                            slidesPerView = "auto"
                            spaceBetween= {30}
                            loop= {true}
                            autoplay= {{
                                delay: 2500,
                            }}
                            pagination={{
                                el: ".swiper-pagination-two",
                                clickable : true
                            }}
                            navigation= {{
                                nextEl: ".portfolio-button-next",
                                prevEl: ".portfolio-button-prev",
                            }}
                            modules={[Navigation, Pagination]}
                            breakpoints = {{
                                1200: {
                                    slidesPerView: "auto",
                                },
                                576: {
                                    slidesPerView: "auto",
                                },
                                300: {
                                    slidesPerView: 1,
                                },
                            }}
                        >                        
                            {SliderData.map((elem, ind)=>(
                                <SwiperSlide key={ind}>
                                    <div className="portfolio-box style-2">
                                        <div className="dz-media">
                                            <Link href="/portfolio-details-1">
                                                <Image src={elem.image} alt="/" />
                                            </Link>
                                        </div>
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-secondary">Bottles</span>
                                                </Link>
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-5">{elem.name}</Link></h4>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}                      
                        </Swiper>
                    </div>
                    <div className="swiper-pagination-two"></div>
                </section>
            </div>
        </>
    )
}