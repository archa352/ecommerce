import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import TeamCreators from "@/elements/About/TeamCreators";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

const OurTeam = () => {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner currentText="Our Team" mainText="Our Team"  parentText="Home" image={IMAGES.BackBg1.src} />
                <section className="content-inner">
                    <div className="container">                    
                        <TeamCreators />                    
                    </div>
                </section>
            </div>
        </>
    );
};

export default OurTeam;