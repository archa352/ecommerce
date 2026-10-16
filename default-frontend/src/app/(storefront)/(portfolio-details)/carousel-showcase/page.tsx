"use client"
import {Swiper, SwiperSlide } from "swiper/react"
import IMAGES from "@/constant/theme";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import Image, { StaticImageData } from "next/image";

interface SliderDatatype{
    image : string | StaticImageData;
    name : string;
} 
const SliderData : SliderDatatype[] = [
    { image : IMAGES.Portfolio9Pic1, name:"Cozy Knit Cardigan Sweater"},
    { image : IMAGES.Portfolio9Pic2, name:"Sophisticated Swagger Suit"},
    { image : IMAGES.Portfolio9Pic3, name:"Classic Denim Skinny Jeans"},
    { image : IMAGES.Portfolio9Pic1, name:"Athletic Mesh Sports Leggings"},
    { image : IMAGES.Portfolio9Pic2, name:"Vintage Denim Overalls Shorts"},
];

export default function CarouselShowcase(){
    return(
        <>
            <div className="page-content bg-light">
                <section className="pt-0 z-index-unset bg-white overflow-hidden">
                    <div className="container-fluid">
                        <div className="d-sm-flex justify-content-sm-between  justtify-content-center py-sm-3  py-3 mb-sm-0 m-b20">
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Carousel Showcase</li>
                                </ul>
                            </nav>
                            <div className="pagination-align style-2">
                                <div className="portfolio-button-prev swiper-button-prev">Prev </div>
                                <div className="portfolio-button-next swiper-button-next">Next</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="container-fluid">
                        <Swiper className="portfolio-gallery3"
                            slidesPerView = {3}
                            spaceBetween = {30}
                            loop = {true}                        
                            pagination= {{
                                el: ".swiper-pagination-two",
                                clickable : true
                            }}
                            navigation ={{
                                nextEl: ".portfolio-button-next",
                                prevEl: ".portfolio-button-prev",
                            }}
                            modules={[Navigation, Pagination]}
                            breakpoints= {{
                                1200: {
                                    slidesPerView: 3,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                600: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                300: {
                                    slidesPerView: 1,
                                    spaceBetween: 15,
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
                    <div className="banner-social-media">
                        <ul>
                            <li>
                                <Link className="text-dark" href={"#"}>Instagram</Link>
                            </li>
                            <li>
                                <Link className="text-dark" href={"#"}>Facebook</Link>
                            </li>
                            <li>
                                <Link className="text-dark" href={"#"}>twitter</Link>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
}