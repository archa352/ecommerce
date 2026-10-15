import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import { FooterMenu, FooterStyleCode4, OurStores, UsefulLinks, WidgetData } from "@/constant/Alldata";
import CopySectionText from "@/constant/CopySectionText";
import SubscribeNewsletter from "@/components/SubscribeNewsletter";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function FooterStyle4(){
    let year =  new Date().getFullYear();
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 4" mainText="Footer Style 4" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">
                                    <CopySectionText code={FooterStyleCode4} />
                                    <pre className="code-box" id="copyTarget">
{FooterStyleCode4}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="site-footer style-1 footer-dark overlay-black-middle" 
                    style={{backgroundImage:`url('${IMAGES.BackBg1.src}')`, backgroundAttachment:'fixed', backgroundSize:'cover' }}
                >                    
                    <div className="footer-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <div className="widget widget_about me-2">
                                        <div className="footer-logo logo-white">
                                            <Link href={"/"}><Image src={IMAGES.LogoWhite} alt="logo" /></Link> 
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
                                <div className="col-xl-3 col-md-4 col-sm-6">
                                    <div className="widget widget_post">
                                        <h5 className="footer-title">Recent Posts</h5>
                                        <ul>
                                            {WidgetData.map((item, ind)=>(
                                                <li key={ind}>
                                                    <div className="dz-media"><Image src={item.image} alt="" /></div>
                                                    <div className="dz-content">
                                                        <h6 className="name"><Link href="/post-standard">{item.name}</Link></h6>
                                                        <span className="time">April 23, 2024</span>
                                                    </div>
                                                </li>
                                            ))}                                    
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-6" >
                                    <div className="widget widget_services">
                                        <h5 className="footer-title">Our Stores</h5>
                                        <ul>
                                            {OurStores.map((item,ind)=>(
                                                <li key={ind}><Link href={"#"}>{item.name}</Link></li>
                                            ))}                                    
                                        </ul>   
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4 col-6">
                                    <div className="widget widget_services">
                                        <h5 className="footer-title">Useful Links</h5>
                                        <ul>
                                            {UsefulLinks.map((item, i)=>(
                                                <li key={i}><Link href="#">{item.name}</Link></li>
                                            ))}                                    
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 col-sm-4">
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
                    </div>
                    {/*  Footer Top End  */}

                    {/*  Footer Bottom  */}
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row fb-inner">
                                <div className="col-lg-6 col-md-12 text-start"> 
                                    <p className="copyright-text">© <span className="current-year">{year}</span> 
                                        <Link href="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                                    </p>
                                </div>
                                <div className="col-lg-6 col-md-12 text-end"> 
                                    <div className="d-flex align-items-center justify-content-center justify-content-md-center justify-content-xl-end">
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