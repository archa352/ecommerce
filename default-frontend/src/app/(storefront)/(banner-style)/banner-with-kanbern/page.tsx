"use client"
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import IMAGES from "@/constant/theme";
import { Autoplay, Parallax, EffectFade } from 'swiper/modules';
import BannerCommanSection from '@/components/BannerCommanSection';

export default function BannerWithKanbern(){
    return(
        <div className="page-wraper">            
            <div className="page-content bg-light">		
                <div className="dz-bnr-inr bg-secondary overlay-black-light">
                    <div className="container">
                        <div className="dz-bnr-inr-entry">
                            <h1>Banner Kanbern</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Banner With Video</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <Swiper className="kanbern-bnr swiper"                    
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={"auto"}
                        effect={'fade'}
                        parallax= {true}
                        speed= {1500}
                        autoplay={{
                            delay: 2000,
                        }}
                        modules={[Autoplay, Parallax, EffectFade]}
                    >                    
                        <SwiperSlide><div style={{backgroundImage:`url('${IMAGES.BackBg1.src}')`}}></div></SwiperSlide>
                        <SwiperSlide><div style={{backgroundImage:`url('${IMAGES.BackBg7.src}')`}}></div></SwiperSlide>
                        
                    </Swiper>
                </div>
                <BannerCommanSection />
            </div>
        </div>
    )
}