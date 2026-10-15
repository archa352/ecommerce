"use client"
import { useState } from "react";
import Header3 from "@/components/Header3";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Footer from "@/components/Footer";
import { HeaderThree } from "@/constant/HeaderAllData";
import CopySectionText from "@/constant/CopySectionText";


export default function HeaderStyleThree(){
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    return(
        <div className={`page-wraper ${openSidebar ? "active-menu head-index" : ""}`}>
            <Header3 setOpenSidebar={setOpenSidebar} openSidebar={openSidebar}/>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" mainText="Header Style 3" currentText="Header Style 3" image={IMAGES.BackBg1.src}/>
                <div className="content-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="code-copy">
                                <CopySectionText code={HeaderThree} />
<pre className="code-box" id="copyTarget">    
  {HeaderThree}
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