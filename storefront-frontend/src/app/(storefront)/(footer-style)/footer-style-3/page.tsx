import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import SocialIcon from "@/elements/SocialIcon";
import { FooterMenu, FooterStyleCode3, OurStores, UsefulLinks } from "@/constant/Alldata";
import Link  from "next/link";
import CopySectionText from "@/constant/CopySectionText";
import Image from "next/image";


export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

interface footerImagetype{
    image: string
}

const footerImage : footerImagetype[] = [
    { image: IMAGES.PostPic1},
    { image: IMAGES.PostPic2},
    { image: IMAGES.PostPic3},
    { image: IMAGES.PostPic4},
]

export default function FooterStyle3(){
    let det = new Date();
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 3" mainText="Footer Style 3" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">

                                <div className="code-copy">
                                    <CopySectionText code={FooterStyleCode3} />
                                    <pre className="code-box" id="copyTarget">
{FooterStyleCode3}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="site-footer footer-dark style-3">		
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-lg-4 col-md-12 px-0">
                                <div className="row dz-post g-0 spno">
                                    {footerImage.map((elem, index)=>(
                                        <div className="col-lg-6 col-6" key={index}>
                                            <div className="dz-post-media">
                                                <Image src={elem.image} alt="" />
                                            </div>
                                        </div>
                                    ))}                                    
                                    <Link href={"#"} className="instagram-link">
                                        <div className="follow-link bg-white wow bounceIn" data-wow-delay="0.1s">
                                            <div className="follow-link-icon">
                                                <Image src={IMAGES.InstaFollow} alt="follow" />
                                            </div>
                                            <div className="follow-link-content">
                                                <h4>Share with #Pixio</h4>
                                                <p>Follow @Pixio for inspiration.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-8 col-md-12">
                                <div className="footer-top">
                                    <div className="dz-custom-container">
                                        <div className="row align-items-center logo-topbar gx-0 wow fadeInUp" data-wow-delay="0.1s">
                                            <div className="col-12 col-sm-6">
                                                <div className="footer-logo logo-white mb-0">
                                                    <Link href="/"><Image src={IMAGES.LogoWhiteSvg} alt=""/></Link> 
                                                </div>	
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="dz-social-icon style-1">
                                                    <ul>                                                        
                                                        <SocialIcon />
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.2s">
                                                <div className="widget widget_services">
                                                    <h5 className="footer-title">Our Stores</h5>
                                                    <ul>
                                                        {OurStores.map((item,ind)=>(
                                                            <li key={ind}><Link href={"#"}>{item.name}</Link></li>
                                                        ))}                                                                                                                                                    
                                                    </ul>   
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-6 wow fadeInUp" data-wow-delay="0.3s">
                                                <div className="widget widget_services">
                                                    <h5 className="footer-title">Useful Links</h5>
                                                    <ul>
                                                        {UsefulLinks.map((item, i)=>(
                                                            <li key={i}><Link href="#">{item.name}</Link></li>
                                                        ))} 
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-12 wow fadeInUp" data-wow-delay="0.4s">
                                                <div className="widget widget_services">
                                                    <h5 className="footer-title">Footer Menu</h5>
                                                    <ul>
                                                        {FooterMenu.map((item,ind)=>(
                                                            <li key={ind}><Link href="#">{item.name}</Link></li>
                                                        ))}
                                                    </ul>                                                        
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Footer Bottom --> */}
                                <div className="footer-bottom wow fadeInUp" data-wow-delay="0.5s">
                                    <div className="fb-inner">
                                        <div className="text-center"> 
                                            <p className="copyright-text">© <span className="current-year">{det.getFullYear()}</span> 
                                                <Link href="https://www.dexignzone.com/"> DexignZone</Link> Theme. All Rights Reserved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Footer Bottom End --> */}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Fragment>
    )
}