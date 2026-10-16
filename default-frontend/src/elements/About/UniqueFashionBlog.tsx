import Image from "next/image";
import IMAGES from "../../constant/theme";

const UniqueFashionBlog = () => {
    return (
        <div className="container">
            <div className="row about-style2 align-items-xl-center align-items-start">
                <div className="col-lg-6 col-lg-5 col-sm-5 m-b30 sticky-top">
                    <div className="about-thumb">
                        <Image src={IMAGES.MenPng} alt="Man" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-7 col-sm-7">
                    <div className="about-content">
                        <div className="section-head style-2 d-block">
                            <h3 className="title w-100">Elevate Your Style: A Unique Fashion Experience at Pixio</h3>
                            <p>At Untouch, we're dedicated to creating an exclusive fashion destination that transcends the ordinary. Our passion for style, quality, and individuality drives our mission. Our collection is a carefully curated blend of timeless classics and the latest trends,</p>
                            <p>In addition to our extensive collection, we're equally devoted to ensuring your shopping experience is seamless and enjoyable. Our website is designed with your convenience in mind, offering secure transactions and a responsive customer support team to assist you every step of the way.</p>
                        </div>
                        <div className="about-bx-detail">
                            <div className="about-bx-pic radius">
                                <Image src={IMAGES.testimonial4} alt="testimonial" />
                            </div>
                            <div>
                                <h6 className="name">Kenneth Fong</h6> 
                                <span className="position">Ceo and founder</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>    
    );
};

export default UniqueFashionBlog;