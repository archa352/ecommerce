import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import Link from "next/link";
import SocialIcon from "@/elements/SocialIcon";
import { FooterStyleCode5 } from "@/constant/Alldata";
import CopySectionText from "@/constant/CopySectionText";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function FooterStyle5(){
    let year =  new Date().getFullYear();
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 5" mainText="Footer Style 5" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">
                                    <CopySectionText code={FooterStyleCode5} />
                                    <pre className="code-box" id="copyTarget">
    {FooterStyleCode5}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="site-footer footer-dark">
                    <div className="footer-top">
                        <div className="container">                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="widget widget_about me-2">
                                        <div className="footer-logo logo-white">
                                            <Link href="/"><Image src={IMAGES.LogoWhiteSvg} alt="logo" /></Link> 
                                        </div>
                                        <ul className="widget-address nav-inline">
                                            <li>
                                                <p><span>E-mail</span> : example@info.com</p>
                                            </li>
                                            <li>
                                                <p><span>Phone</span> : (064) 332-1233</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="widget widget_services text-lg-end">
                                        <ul className="nav-inline mb-3">
                                            <li><Link href="/about-us">About Us</Link></li>
                                            <li><Link href="/blog-dark-2-column-sidebar">Latest News</Link></li>
                                            <li><Link href="/faqs-2">Help Desk</Link></li>
                                            <li><Link href="/contact-us-1">Contact Us</Link></li>
                                        </ul>
                                        <ul className="nav-inline">
                                            <SocialIcon />                                                                                                                               
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row fb-inner">
                                <div className="col-lg-6 col-md-12 text-start"> 
                                    <p className="copyright-text">© <span className="current-year">{year}</span> 
                                        <Link href="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                                    </p>
                                </div>
                                <div className="col-lg-6 col-md-12 text-end"> 
                                    <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-lg-end">
                                        <span className="me-3">We Accept: </span>
                                        <Image src={IMAGES.FooterImg} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </footer>
            </div>
        </Fragment>
    )
}