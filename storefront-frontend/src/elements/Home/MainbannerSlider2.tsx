"use client"
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample Data
import { MainSwiperData, MainSwiperData2 } from '../../constant/Alldata';

const MainBannerSlider2 = () => {  
    const mainSliderRef = useRef<Slider | null>(null);
    const thumbSliderRef = useRef<Slider | null>(null);
    // slider arrow
    const [nav1, setNav1] = useState<Slider | undefined>(undefined);
    const [nav2, setNav2] = useState<Slider | undefined>(undefined);
    useEffect(() => {
      setNav1(mainSliderRef.current || undefined);
      setNav2(thumbSliderRef.current || undefined);
  }, []);
    
    const mainSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        infinite: true,
        // asNavFor: thumbSliderRef.current!,
        asNavFor: nav2,
    };
  
    const thumbSettings = {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: false,
        centerMode: false,
        infinite: true,
        focusOnSelect: true,
        // asNavFor: mainSliderRef.current!,
        asNavFor: nav1,
    };

  return (
    <div className="row main-slide">
      {/* Main Slider */}
      <div className="col-lg-6">
        <Slider ref={mainSliderRef} {...mainSettings} className="slider-main">
            {MainSwiperData.map((item, index) => (                
                <div className="content-info" key={index}>
                    <h1 className="title">{item.title}</h1>
                    <div className="swiper-meta-items">
                        <div className="meta-content">
                            <span className="price-name">Price</span>
                            <span className="price-num d-inline-block">&#036;{item.price}</span>
                        </div>
                    </div>
                    <div className="content-btn m-b30">
                        <Link href="/shop-cart" className="btn btn-secondary me-xl-3 me-2 btnhover20">ADD TO CART</Link>
                        <Link href="/product-default" className="btn btn-outline-secondary btnhover20">VIEW DETAIL </Link>
                    </div>
                </div>              
            ))}
        </Slider>
      </div>
      <div className="col-lg-6">
        <Slider ref={thumbSliderRef} {...thumbSettings} className="slider-thumbs">
          {MainSwiperData2.map((item, i) => (            
            <div className="banner-media" key={i} data-name={item.name}>
                <div className="img-preview">
                    <Image src={item.image} alt="banner-media" />
                </div>
            </div>           
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default MainBannerSlider2;