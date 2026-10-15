"use client"
import {Swiper, SwiperSlide } from "swiper/react"
import IMAGES from "@/constant/theme";
import { Mousewheel, Pagination, Parallax } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioSplitSlider(){
    return(
        <>
            <div className="page-content bg-light">
                <div className="content-block">
                    <div className="section-full overflow-hidden">
                        <div id="home-slider" className="split-area">
                            <div className="swiper-pagination-two style-1"></div>
                            <Swiper className="spilt-swiper-slider spilt-slider-wrapper"
                                direction= "vertical"
                                loop= {true}
                                slidesPerView = {1}
                                mousewheel= {true}                            
                                pagination= {{
                                    el: ".swiper-pagination-two",
                                    clickable : true
                                }}
                                grabCursor= {true}
                                parallax= {true}
                                speed= {1000}
                                effect= "slide"
                                // @ts-ignore
                                mousewheelcontrol= {1}
                                modules={[Pagination, Parallax, Mousewheel ]}
                            >                           
                                <SwiperSlide>
                                    <div className="swiper-image swiper-bg portfolio-box style-2 rounded-0" data-swiper-parallax-y="35%" 
                                        style={{backgroundImage:`url('${IMAGES.Portfolio10Pic1.src}')`}}
                                    >
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">Bottles</span>
                                                </Link>
                                            </div>
                                            <h4 className="title">
                                                <Link href="/portfolio-details-1"> Hydrate with Confidence using Sturdy Wooden Bottles</Link>
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="swiper-image">
                                        <div className="swiper-content">
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">
                                                        <Image src={IMAGES.Portfolio10Pic2.src} alt="/" 
                                                            style={{ objectFit: 'cover' }}
                                                            width="500" height="500"                
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="dz-content">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-primary">Bottles</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-1"> Hydrate with Confidence using Sturdy Wooden Bottles</Link></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="swiper-image">
                                        <div className="swiper-content">
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">
                                                        <Image src={IMAGES.Portfolio10Pic3.src} alt="/" 
                                                            width="500" height="500"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="dz-content">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-primary">Paper Bags</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-2">Simplify Your Life with Practical Paper Bag </Link></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-image swiper-bg portfolio-box style-2 rounded-0" data-swiper-parallax-y="35%"  
                                        style={{backgroundImage:`url('${IMAGES.Portfolio10Pic4.src}')`}}>
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">Bottles</span>
                                                </Link>
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-1">Simplify Your Life with Practical Paper Bag</Link></h4>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="swiper-image swiper-bg portfolio-box style-2 rounded-0" data-swiper-parallax-y="20%" 
                                        style={{backgroundImage:`url('${IMAGES.Portfolio10Pic5.src}')`}}
                                    >
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">Bottles</span>
                                                </Link>
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-1">Simplify Your Life with Practical Paper Bag</Link></h4>
                                        </div>
                                    </div>
                                    <div className="swiper-image">
                                        <div className="swiper-content">
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">                                                        
                                                        <Image src={IMAGES.Portfolio10Pic6.src} alt="/" 
                                                            width="500" height="500"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="dz-content">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-primary">Glass</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-3">Unveiling the Aesthetic Blend of Wood and Glass</Link></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="swiper-image">
                                        <div className="swiper-content">
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">                                                        
                                                        <Image src={IMAGES.Portfolio10Pic8.src} alt="/" 
                                                            width="500" height="500"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="dz-content">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-primary">Bowls</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-4">Uncovering the Beauty of Plant-Based Products</Link></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="swiper-image swiper-bg portfolio-box style-2 rounded-0" data-swiper-parallax-y="35%"  
                                        style={{backgroundImage:`url('${IMAGES.Portfolio10Pic7.src}')`}}
                                    >
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">Tumbler</span>
                                                </Link>
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-4">Uncovering the Beauty of Plant-Based Products</Link></h4>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="swiper-image swiper-bg portfolio-box style-2 rounded-0" data-swiper-parallax-y="20%" 
                                        style={{backgroundImage:`url('${IMAGES.Portfolio10Pic9.src}')`}}
                                    >
                                        <div className="dz-content">
                                            <div className="product-tag">
                                                <Link href="/portfolio-details-1">
                                                    <span className="badge badge-primary">Tumbler</span>
                                                </Link>
                                            </div>
                                            <h4 className="title"><Link href="/portfolio-details-4">Uncovering the Beauty of Plant-Based Products</Link></h4>
                                        </div>
                                    </div>
                                    <div className="swiper-image">
                                        <div className="swiper-content">
                                            <div className="portfolio-box style-2 rounded-0">
                                                <div className="dz-media">
                                                    <Link href="/portfolio-details-1">                                                        
                                                        <Image src={IMAGES.Portfolio10Pic11} alt="/" 
                                                            width="500" height="500"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="dz-content">
                                                    <div className="product-tag">
                                                        <Link href="/portfolio-details-1">
                                                            <span className="badge badge-primary">Bottal</span>
                                                        </Link>
                                                    </div>
                                                    <h4 className="title"><Link href="/portfolio-details-5">Go Green with the Best Reusable Metal Bottles</Link></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>                            
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}