import Link from "next/link";
import CommanSection from "@/components/BannerCommanSection";
import IMAGES from "@/constant/theme";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function BannerLarge() {
    return (
        <div className="page-wraper">
            <div className="page-content bg-light">
                <div className="dz-bnr-inr bg-secondary overlay-black-light dz-bnr-inr-lg" style={{ backgroundImage: `url('${IMAGES.BackBg1.src}')` }}>
                    <div className="container">
                        <div className="dz-bnr-inr-entry d-table-cell">
                            <h1>Banner Large</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Banner Large</li>
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