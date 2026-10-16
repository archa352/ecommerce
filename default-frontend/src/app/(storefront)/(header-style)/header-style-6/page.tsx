"use client"

import Link from "next/link";
import Footer from "@/components/Footer";
import Header6 from "@/components/Header6";
import CopySectionText from "@/constant/CopySectionText";
import { HeaderSix } from "@/constant/HeaderAllData";


export default function HeaderStyleSix(){
    return(
        <div className="page-wraper">
            <Header6 />
            <div className="page-content bg-light">		
                <div className="dz-bnr-inr bg-secondary">
                    <div className="container">
                        <div className="dz-bnr-inr-entry">
                            <h1>Header Style 6</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={"#"}> Home</Link></li>
                                    <li className="breadcrumb-item">Header Style 6</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-inner">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="code-copy">
                            <CopySectionText code={HeaderSix} />
<pre className="code-box" id="copyTarget">
    {HeaderSix}   
</pre>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}