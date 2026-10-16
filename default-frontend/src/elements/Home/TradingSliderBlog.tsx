import {Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { SVGICON } from "../../constant/theme";
import { TradingSliderBlogdata } from "../../constant/Alldata";
import Image from "next/image";

const TradingSliderBlog = () => {
    return (
       <Swiper 
            slidesPerView = {4.5}
            spaceBetween = {30}
            loop = {true}
            speed = {1000}			
            breakpoints = {{
                1600: {
                    slidesPerView: 4.5,
                },
                1400: {
                    slidesPerView: 3.5,
                },
                1024: {
                    slidesPerView: 2.5,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 1.5,
                    spaceBetween: 15,
                    centeredSlides: true,
                },
                575: {
                    slidesPerView: 1.5,
                    spaceBetween: 15,
                    centeredSlides: true,
                },
                300: {
                    slidesPerView: 1.2,
                    spaceBetween: 15,
                },                
            }}
            className="swiper swiper-blog-post"
        >
          
            {TradingSliderBlogdata.map((item, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="dz-card style-2">
                        <div className="dz-media">
                            <Image src={item.image} alt="media" />
                            <div className="post-date">{item.date}</div>
                        </div>
                        <div className="dz-info">
                            <h4 className="dz-title mb-0">
                                <Link href="/blog-dark-3-column">{item.name}</Link>
                            </h4>
                            <ul className="blog-social">
                                <li>
                                    <Link href={'#'} className="share-btn" dangerouslySetInnerHTML={{__html : SVGICON.ArrowUp15Degree}}></Link>
                                    <ul className="sub-team-social">
                                        <li><Link href="https://www.facebook.com/" target="_blank"><i className="fab fa-facebook-f" /></Link></li>
                                        <li><Link href="https://www.behance.net/dexignzone" target="_blank"><i className="fa-brands fa-behance" /></Link></li>
                                        <li><Link href="https://www.instagram.com/" target="_blank"><i className="fab fa-instagram" /></Link></li>
                                        <li><Link href="https://www.linkedin.com/" target="_blank"><i className="fa-brands fa-linkedin-in" /></Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </SwiperSlide>
            ))}            
        </Swiper>
    );
};

export default TradingSliderBlog;