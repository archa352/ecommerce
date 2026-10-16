import { Fragment } from "react/jsx-runtime";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FooterStyleCode2 } from "@/constant/Alldata";
import CopySectionText from "@/constant/CopySectionText";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function FooterStyle2(){
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 2" mainText="Footer Style 2" parentText="Home" image={IMAGES.BackBg1.src} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">
                                    <CopySectionText code={FooterStyleCode2} />
                                    <pre className="code-box" id="copyTarget">
{FooterStyleCode2}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer footerStyle="footer-dark" />
            </div>
        </Fragment>
    )
}