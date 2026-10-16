import Link from "next/link";
import CommanSection from "@/components/BannerCommanSection";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function BannerWithVideo() {
    return (
        <div className="page-wraper">            
            <div className="page-content bg-light">
                <div className="dz-bnr-inr bg-secondary overlay-black-light">                        
                    <video autoPlay loop muted id="video-background">
                        <source src="/assets/images/background/bg-video.mp4" type="video/mp4" />
                    </video>                    
                    <div className="container">
                        <div className="dz-bnr-inr-entry">
                            <h1>Banner With Video</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Banner With Video</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <CommanSection />
            </div>
        </div>
    )
}