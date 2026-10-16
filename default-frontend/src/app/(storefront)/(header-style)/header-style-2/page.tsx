"use client"
import CommanBanner from "@/components/CommanBanner";
import Footer from "@/components/Footer";
import Header2 from "@/components/Header2";
import CopySectionText from "@/constant/CopySectionText";
import { HeaderTwo } from "@/constant/HeaderAllData";
import IMAGES from "@/constant/theme";

export default function HeaderStyleTwo(){
    return(
        <div className="page-wraper">
            <Header2 />
            <div className="page-content bg-light">
                <CommanBanner currentText="Header Style 2" mainText="Header Style 2" parentText="Home" image={IMAGES.BackBg1.src} />
                <div className="content-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="code-copy">
                                <CopySectionText code={HeaderTwo} />
<pre className="code-box" id="copyTarget">
 {HeaderTwo}
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