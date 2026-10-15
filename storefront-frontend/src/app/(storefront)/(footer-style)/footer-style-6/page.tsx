import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import Link from "next/link";
import { FooterMenu, FooterStyleCode6, UsefulLinks } from "@/constant/Alldata";
import CopySectionText from "@/constant/CopySectionText";
import SubscribeNewsletter from "@/components/SubscribeNewsletter";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function FooterStyle6(){
    let year =  new Date().getFullYear();
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 6" mainText="Footer Style 6" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">                                    
                                    <CopySectionText code = {FooterStyleCode6} />
                                    <pre className="code-box" id="copyTarget">
{FooterStyleCode6}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="site-footer footer-map footer-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-lg-4 col-sm-12 px-0">
                                <div className="map-iframe map">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970649679!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C+Rajasthan!5e0!3m2!1sen!2sin!4v1500819483219" 
                                        style={{border:'0', width:"100%", minHeight:"100%", marginBottom: "-8px"}} allowFullScreen>                                        
                                    </iframe>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                
                                <div className="footer-top m-t30">
                                    <div className="row">
                                        <div className="col-xl-6 col-md-12">
                                            <div className="widget widget_about">
                                                <div className="footer-logo logo-white">
                                                    <Link href="/"><Image src={IMAGES.LogoWhiteSvg} alt="logo" /></Link>
                                                </div>
                                                <ul className="widget-address">
                                                    <li>
                                                        <p><span>Address</span> : 451 Wall Street, UK, London</p>
                                                    </li>
                                                    <li>
                                                        <p><span>E-mail</span> : example@info.com</p>
                                                    </li>
                                                    <li>
                                                        <p><span>Phone</span> : (064) 332-1233</p>
                                                    </li>
                                                </ul>
                                                <div className="subscribe_widget">
                                                    <h6 className="title fw-medium text-capitalize">subscribe to our newsletter</h6>	
                                                    <SubscribeNewsletter />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-6">
                                            <div className="widget widget_services">
                                                <h5 className="footer-title">Useful Links</h5>
                                                <ul>
                                                    {UsefulLinks.map((item, i)=>(
                                                        <li key={i}><Link href="#">{item.name}</Link></li>
                                                    ))} 
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-6">
                                            <div className="widget widget_services">
                                                <h5 className="footer-title">Footer Menu</h5>
                                                <ul>
                                                    {FooterMenu.map((item,ind)=>(
                                                        <li key={ind}><Link href={"#"}>{item.name}</Link></li>
                                                    ))}  
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer-bottom">
                                    <div className="fb-inner">
                                        <div className="text-start"> 
                                            <p className="copyright-text">© <span>{year}</span> 
                                                <Link href="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                                            </p>
                                        </div>
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