import Link from "next/link";
import IMAGES from "../../constant/theme";
import SwiperTestimonial from "./SwiperTestimonial";
import Image from "next/image";

export default function LatestoCollection(){
    return(
        <div className="row align-items-center">
            <div className="col-lg-4 col-md-12 m-b30">
                <div className="dz-media style-2 wow fadeInUp" data-wow-delay="0.2s">
                    <Image src={IMAGES.AboutPic8} alt="about" />
                </div>
            </div>
            <div className="col-lg-8 col-md-12 m-b30">
                <div className="about-wraper   position-relative">
                    <div className="section-head style-1 wow fadeInUp d-lg-flex justify-content-between align-items-center" data-wow-delay="0.4s">
                        <h3 className="title ">Discover latest collection</h3>
                        <Link href="/about-us" className="service-btn-2 wow fadeInUp position-relative light  d-md-flex  d-none" data-wow-delay="0.6s" >
                            <span className="icon-wrapper">
                                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.832 31.1663L31.1654 12.833" stroke="var(--title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12.832 12.833H31.1654V31.1663" stroke="var(--title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </span>
                        </Link>
                    </div>                    
                   <SwiperTestimonial />
                </div>
            </div>
        </div>
    )
}