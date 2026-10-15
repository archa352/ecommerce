import Link from "next/link";
import IMAGES from "@/constant/theme";
import SocialIcon from "@/elements/SocialIcon";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",
};
export default function page() {
  return (    
    <div className="page-content">
        <section className="overflow-hidden">
            <div className="row error-page style-2">
                <div className="col-lg-6 col-md-6 error-start-content">
                    <div className="logo">
                        <Link href={"/"}><Image src={IMAGES.LogoWhite} alt="logo" /></Link>
                    </div>
                    <div className="dz_error">404</div>
                    <div className="dz-social-icon style-2 white">
                        <SocialIcon />
                    </div>
                    <Image src={IMAGES.CircleLine3} className="bg-img" alt="circle" />
                </div>
                <div className="col-lg-6 col-md-6 error-end-content">
                    <div className="error-inner">
                        <h1 className="error-head">OOPS!</h1>
                        <p className="error-para">Oh, no! This page does not exist.</p>
                        <Link href={"/"} className="btn btn-secondary text-uppercase">Go to Main Page</Link>
                    </div>
                    <Image src={IMAGES.CircleLine4} className="bg-img2" alt="" />
                </div>
            </div>
        </section>
    </div>
    
  );
}
