import CommanBanner from "@/components/CommanBanner";
import CopySectionText from "@/constant/CopySectionText";
import { HeaderOne } from "@/constant/HeaderAllData";
import IMAGES from "@/constant/theme";

export default function HeaderStyleOne(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner currentText="Header Style 1" mainText="Header Style 1" parentText="Home" image={IMAGES.BackBg1.src} />
                <div className="content-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="code-copy">
                                <CopySectionText code={HeaderOne} />
    <pre className="code-box" id="copyTarget">
    // here design="";
        {HeaderOne}   
    </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}