import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import { voucherBlogData } from "@/constant/Alldata";
import IMAGES from "@/constant/theme";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

const OurGiftVouchers = () => {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner mainText="Our Gift Vouchers" currentText="Our Gift Vouchers" parentText="Home" image={IMAGES.BackBg1.src} />
                <section className="content-inner">
                    <div className="container">
                        <div className="row">
                            {voucherBlogData.map((item, ind)=>(
                                <div className="col-lg-4 col-md-6 col-sm-6"  key={ind}>
                                    <div className="gift-bx">
                                        <div className="gift-media">
                                            <Image src={item.image} alt="gift" />
                                        </div>
                                        <div className="gift-content">
                                            <h6 className="title"><Link href="/shop-list">{item.name}</Link></h6> 
                                            <p className="text">Our gift cards are available in a range of denominations, so you can choose the perfect amount for any occasion.</p> 
                                        </div>
                                    </div>
                                </div>
                            ))}					
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default OurGiftVouchers;