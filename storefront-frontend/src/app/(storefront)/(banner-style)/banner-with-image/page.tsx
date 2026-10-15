import Link from "next/link";
import IMAGES from "@/constant/theme";
import CommanSection from "@/components/BannerCommanSection";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function BannerWithImage(){
    return(
        <>
            <div className="page-content bg-light">		
                <div className="dz-bnr-inr" style={{backgroundImage:`url('${IMAGES.BgShape.src}')`}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="dz-bnr-inr-entry text-start">
                                    <h1>Banner With Image</h1>
                                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                            <li className="breadcrumb-item">Banner With Image</li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>	
                        <div className="banner-media">
                            <Image src={IMAGES.BannerPic} alt="bnner" />
                        </div>
                    </div>	
                </div>
                <CommanSection />
            </div>
        </>
    )
}