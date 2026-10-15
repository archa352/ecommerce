import { Fragment } from "react/jsx-runtime";
import IMAGES from "@/constant/theme";
import Link from "next/link";
import TeamCreators from "@/elements/About/TeamCreators";
import Image from "next/image";

const BannerCommanSection = () => {
    return(
        <Fragment>
            <section className="content-inner">
                <div className="container">
                    <div className="row about-style2 align-items-center">
                        <div className="col-lg-6 col-md-12 col-sm-12 m-b30">
                            <div className="about-thumb">
                                <Image src={IMAGES.MenPng} alt="men" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 m-b30">
                            <div className="about-content">
                                <div className="section-head style-1 d-block">
                                    <h3 className="title">About Pixio Our Story and Mission in Ecommerce</h3>
                                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
                                    <p>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                                </div>
                                <div className="about-bx-detail">
                                    <div className="about-bx-pic radius">
                                        <Image src={IMAGES.testimonial4} alt="test" />
                                    </div>
                                    <div>
                                        <h6 className="name">Kenneth Fong</h6>
                                        <span className="position">Postgraduate Student</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="get-in-touch">
                <div className="m-r100 m-md-r0 m-sm-r0">
                    <h3 className="dz-title mb-lg-0 mb-3">Questions ?
                        <span>Our experts will help find the grar that’s right for you</span>
                    </h3>
                </div>
                <Link href="/contact-us-3" className="btn btn-light">Get In Touch</Link>
            </section>
            <section className="content-inner">
                <div className="container">
                    <TeamCreators />
                </div>
            </section>
        </Fragment>
    )
}
export default BannerCommanSection;