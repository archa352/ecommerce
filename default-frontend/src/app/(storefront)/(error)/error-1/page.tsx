import Link from "next/link"
import IMAGES from "@/constant/theme"
import Image from "next/image"

export const metadata = {
    title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
    description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};


const ErrorPage1 = () =>{
    return(
        <>
            <div className="page-content bg-light">
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-10 col-md-12">
                                <div className="error-page style-1">
                                    <div className="dz-error-media">
                                        <Image src={IMAGES.ErrorPic4}   alt="error" />
                                    </div>
                                    <div className="error-inner">
                                        <h1 className="dz_error">404</h1>
                                        <p className="error-head">Oh, no! This page does not exist.</p>
                                        <Link href="/" className="btn btn-secondary text-uppercase">Go to Main Page</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>                
            </div>
        </>
    )
}
export default ErrorPage1