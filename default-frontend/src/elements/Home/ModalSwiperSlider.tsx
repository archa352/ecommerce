import { useState } from 'react';
import {  Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import IMAGES from '../../constant/theme';
import Link from 'next/link';
import Image from 'next/image';

const modalSwiperData = [
    { image: IMAGES.productlady1, image2 : IMAGES.thumbproductlady1},
    { image: IMAGES.productlady2, image2 : IMAGES.thumbproductlady2},
    { image: IMAGES.productlady3, image2 : IMAGES.thumbproductlady3},    
];

const ModalSwiperSlider = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return (
        <div className="swiper-btn-center-lr">
            <Swiper 
                spaceBetween= {0}
			    updateOnWindowResize= {true}                                
                modules={[Thumbs]}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                className="swiper quick-modal-swiper2"
            >                
                {modalSwiperData.map((item, ind)=>(
                    <SwiperSlide key={ind}>
                        <div className="dz-media DZoomImage">
                            <Link href={item.image} className="mfp-link lg-item"  data-src={item.image}>
                                <i className="feather icon-maximize dz-maximize top-right"></i>
                            </Link>
                            <Image src={item.image} alt="image" />
                        </div>
                    </SwiperSlide>
                ))}                            
            </Swiper>
            <Swiper 
                spaceBetween= {15}
                slidesPerView= {4}
                freeMode= {true}
                watchSlidesProgress= {true}
                onSwiper={(swiper: any) => {
                    setThumbsSwiper(swiper);
                }}
                modules={[Thumbs]}
                className="swiper quick-modal-swiper thumb-swiper-lg thumb-sm swiper-vertical"
            >
                {modalSwiperData.map((item, ind)=>(
                    <SwiperSlide key={ind}>
                        <Image src={item.image2} alt="image" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>	
    );
};

export default ModalSwiperSlider;