"use client"
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react"
import IMAGES from "../../constant/theme";
import Image, { StaticImageData } from "next/image";

interface SliderDatatype{
    image: string | StaticImageData
}
const SliderData : SliderDatatype[] = [
    {image : IMAGES.PortfolioRelated1},
    {image : IMAGES.PortfolioRelated2},
    {image : IMAGES.PortfolioRelated3},
];

export default function Portfolio4Slider(){
    return(
        <Swiper className="swiper swiper-six"
            slidesPerView={2}            
            spaceBetween = {30}
            loop= {true}
            autoplay= {{
                delay: 2500,
            }}
            breakpoints = {{
                591: {
                    slidesPerView: 2,
                },
                340: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
            }}
        >     
            {SliderData.map((item, ind)=>(
                <SwiperSlide>
                    <div className="portfolio-box" key={ind}>
                        <div className="dz-media">
                            <Link href="/portfolio-details-1">
                                <Image src={item.image} alt="/" />
                            </Link>	
                        </div>
                        <div className="dz-content">
                            <div className="product-tag">
                                <Link href="/portfolio-details-1">
                                    <span className="badge badge-primary">Sweater</span>
                                </Link>
                            </div>
                            <h5 className="title"><Link href={"#"}>Cozy Knit Cardigan Sweater</Link></h5>
                        </div>
                    </div>
                </SwiperSlide>
            ))} 
        </Swiper>
    )
}