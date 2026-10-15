import {Swiper, SwiperSlide} from "swiper/react";
import IMAGES from "../../constant/theme";
import { Navigation } from "swiper/modules";
import Image from "next/image";

const AboutClientSlider = () => {
    return (
        <Swiper 
            slidesPerView = {1}
            spaceBetween = {20}
            loop = {true}            
            navigation = {{
                nextEl: ".btn-prev",
                prevEl: ".btn-next",
            }}
            breakpoints = {{
                1600: {
                    slidesPerView: 1,
                },
            }}
            modules={[Navigation]}
            className="swiper swiper-five"
        >
            
            <SwiperSlide>
                <div className="about-content">
                    <p className="para-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                    <div className="about-bx-detail">
                        <div className="about-bx-pic radius">
                            <Image src={IMAGES.testimonial4} alt="" />
                        </div>
                        <div>
                            <h6 className="name">Kenneth Fong</h6> 
                            <span className="position">Postgraduate Student</span> 
                        </div>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="about-content">
                    <p className="para-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                    <div className="about-bx-detail">
                        <div className="about-bx-pic radius">
                            <Image src={IMAGES.testimonial4} alt="" />
                        </div>
                        <div>
                            <h6 className="name">Joe Do</h6> 
                            <span className="position">Undergraduate Student</span> 
                        </div>
                    </div>
                </div>
            </SwiperSlide>            
            <div className="pagination-align">
                <div className="about-button-prev btn-prev" style={{cursor:"pointer"}}>
                    <i className="flaticon flaticon-left-chevron" />
                </div>
                <div className="about-button-next btn-next" style={{cursor:"pointer"}}>
                    <i className="flaticon flaticon-chevron" />
                </div>
            </div>
        </Swiper>
    );
};

export default AboutClientSlider;