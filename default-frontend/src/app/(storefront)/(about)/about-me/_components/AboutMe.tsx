"use client"
import CountUp from "react-countup";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import AboutAccordionBlog from "@/elements/About/AboutAccordionBlog";
import AboutImageBlog from "@/elements/About/AboutImageBlog";
import AboutClientSlider from "@/elements/About/AboutClientSlider";
import Aboutcompanylogo from "@/elements/About/Aboutcompanylogo";
import Image from "next/image";


const AboutMe = () =>{
    return(
        <div className="page-content bg-light">
           <CommanBanner mainText = "About Me" parentText="Home" currentText="About Me" image={IMAGES.BackBg1.src}/>
            <section className="content-inner overflow-hidden">
			    <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-head wow fadeInUp m-md-r100" data-wow-delay="0.1s">
                                <h2 className="title">Pixio Your Style, Quality, Individuality - Redefining Fashion Together.	</h2>
                                <p>At Pixio, we are on a mission to redefine fashion by blending style, quality, and individuality into every garment we offer. We believe that what you wear is an extension of your unique personality, and it should reflect your values and aspirations.</p>	
                            </div>
                            <div className="author-bx-detail m-b40 wow fadeInUp" data-wow-delay="0.2s">
                                <div className="author-bx-pic radius">
                                    <Image src={IMAGES.testimonial4} alt="test" />
                                </div>
                                <div>
                                    <h6 className="name">Kenneth Fong</h6> 
                                    <span className="position">Ceo and founder</span> 
                                </div>
                            </div>
                            <AboutAccordionBlog />
                            <div className="about-sale">
                                <div className="row">
                                    <div className="col-lg-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay="0.4s">
                                        <div className="about-content">
                                            <h2 className="title">
                                                <CountUp end={50} duration={5}/>
                                                +
                                            </h2>
                                            <p className="text">Items Sale</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay="0.5s">
                                        <div className="about-content">
                                            <h2 className="title">400%</h2>
                                            <p className="text">Return on investment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                        <div className="col-lg-6">
                            <AboutImageBlog />
                        </div>		
                    </div>
                </div>
            </section>	
            <section className=" about-style4">
                <div className="container">
                    <div className="row  align-items-center ">
                        <div className="col-lg-6 order-lg-1 order-2">
                            <div className="side-content">
                                <div className="about-thumb">
                                    <Image src={IMAGES.GirlPng} alt="test" />
                                </div>
                                <div className="our-customer wow fadeInUp" data-wow-delay="0.2s" style={{visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp"}}>
                                    <h6>Our Satisfied User</h6>
                                    <ul>
                                        <li className="customer-image">
                                            <Image src={IMAGES.testimoniaPic1} alt="test" />
                                        </li>
                                        <li className="customer-image">
                                            <Image src={IMAGES.testimoniaPic2} alt="test" />
                                        </li>
                                        <li className="total-customer">
                                            <span className="font-14">+12K</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 m-b30 aos-item wow fadeInUp  order-lg-2 order-1 " data-wow-delay="0.3s">
                            <div>
                                <div className="section-head">
                                    <h2 className="title">What our clients say <br/> about us</h2>
                                </div>
                                <AboutClientSlider />
                            </div>
                        </div>
                    </div>
                </div>
                <Image src={IMAGES.LineShape} alt="line" className="line"  /> 
            </section>
            <section className="content-inner-1 companies bg-light ">
                <div className="container">
                    <div className="section-inner">
                        <div className="section-head style-3 wow fadeInUp" data-wow-delay="0.1s">
                            <h2 className="title">We’re just keep growing with 6.3k trusted companies</h2>
                            <p>Nullam nec ipsum luctus, vehicula massa in, dictum sapien. Aenean quis luctus ert nulla quam augue.</p>	
                        </div>
                        <div className="row gx-3 companies-inner">
                            <Aboutcompanylogo />                           
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default AboutMe;