import CommanBanner from "@/components/CommanBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CopySectionText from "@/constant/CopySectionText";
import { HeaderOne } from "@/constant/HeaderAllData";
import IMAGES from "@/constant/theme";

export default function HeaderStyleFour(){
    return(
        <div className="page-wraper">
            <Header design="header-text-white header-transparent" />
            <div className="page-content bg-light">
                <CommanBanner currentText="Header Style 4" mainText="Header Style 4" parentText="Home" image={IMAGES.BackBg1.src} />
                <div className="content-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="code-copy">
                                <CopySectionText code={HeaderOne} />
<pre className="code-box" id="copyTarget">
// here design="header-text-white header-transparent";
 {HeaderOne}   
</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}