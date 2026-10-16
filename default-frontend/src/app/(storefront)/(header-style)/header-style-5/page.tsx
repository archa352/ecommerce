"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, EffectFade } from 'swiper/modules';
import CopySectionText from "@/constant/CopySectionText";
import { HeaderOne } from "@/constant/HeaderAllData";
import IMAGES from "@/constant/theme";
import Link from 'next/link';

export default function HeaderStyleFive(){
    return(
        <>
            <div className="page-content bg-light">
                <div className="dz-bnr-inr bg-secondary overlay-black-light" style={{backgroundImage:`url('${IMAGES.BackBg1.src}')`}}>
                    <div className="container">
                        <div className="dz-bnr-inr-entry">
                            <h1>Header Style 5</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Header Style 5</li>
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
                <div className="content-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="code-copy">
                                <CopySectionText code={HeaderOne} />
    <pre className="code-box" id="copyTarget">
    // here design="";
        {HeaderOne}   
    </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}