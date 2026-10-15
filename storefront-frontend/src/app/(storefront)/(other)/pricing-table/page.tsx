import CommanBanner from "@/components/CommanBanner";
import GetInTouch from "@/components/GetInTouch";
import IMAGES from "@/constant/theme";
import PricingBlog from "@/elements/PricingBlog";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

const PricingTablePage = () =>{
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner mainText="Pricing Table" parentText="Home" currentText="Pricing Table"  image={IMAGES.BackBg1.src} />
                <section className="dz-pricingtable ">
                    <div className="container">
                        <div className="row pricingtable-wraper">
                            <PricingBlog />
                        </div>
                    </div>
                </section>            
                <GetInTouch />
            </div>
        </>
    )
}
export default PricingTablePage;