import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import Link from "next/link";
import { FooterStyleCode7 } from "@/constant/Alldata";
import CopySectionText from "@/constant/CopySectionText";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function FooterStyle7(){
    let year =  new Date().getFullYear();
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 7" mainText="Footer Style 7" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">
                                    <CopySectionText code = {FooterStyleCode7} />
                                    <pre className="code-box" id="copyTarget">
{
FooterStyleCode7
}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="site-footer  footer-dark">
		        {/* <!-- Footer Top --> */}
                    <div className="footer-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="widget widget_about me-2 text-center">
                                        <div className="footer-logo logo-white">
                                            <Link href="/"><Image src={IMAGES.LogoWhiteSvg} alt="logo"/></Link> 
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="widget widget_services text-center">
                                        <ul className="nav-inline mb-3 text">
                                            <li><Link href="/about-us">About Us</Link></li>
                                            <li><Link href="/blog-dark-2-column-sidebar">Latest News</Link></li>
                                            <li><Link href="/faqs-2">Help Desk</Link></li>
                                            <li><Link href="/contact-us-1">Contact Us</Link></li>
                                        </ul>
                                        <ul className="nav-inline">
                                            <li><Link href={"#"} target="_blank" className="site-button-link facebook hover"><i className="fab fa-facebook-f"/></Link></li>
                                            <li><Link href={"#"} target="_blank" className="site-button-link google-plus hover"><i className="fab fa-google-plus-g"/></Link></li>
                                            <li><Link href={"#"} target="_blank" className="site-button-link linkedin hover"><i className="fab fa-linkedin-in"/></Link></li>
                                            <li><Link href={"#"} target="_blank" className="site-button-link instagram hover"><i className="fab fa-instagram"/></Link></li>
                                            <li><Link href={"#"} target="_blank" className="site-button-link twitter hover"><i className="fab fa-twitter"/></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Footer Top End --> */}                    
                    {/* <!-- Footer Bottom --> */}
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row fb-inner">
                                <div className="col-lg-6 col-md-12 text-start"> 
                                    <p className="copyright-text">© <span>{year}</span> <Link href="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.</p>
                                </div>
                                <div className="col-lg-6 col-md-12 text-end"> 
                                    <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-lg-end">
                                        <span className="me-3">We Accept: </span>
                                        <Image src={IMAGES.FooterImg} alt="cards" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Footer Bottom End --> */}                    
                </footer>               
            </div>
        </Fragment>
    )
}   