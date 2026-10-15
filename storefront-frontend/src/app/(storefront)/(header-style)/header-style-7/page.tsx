import Link from "next/link";
import Footer from "@/components/Footer";
import CopySectionText from "@/constant/CopySectionText";
import { HeaderSeven } from "@/constant/HeaderAllData";
import Header7 from "@/components/Header7";

export default function HeaderStyleSeven(){
    return(
        <div className="page-wraper">
            <Header7 />
            <div className="page-content bg-light">		
                <div className="dz-bnr-inr bg-secondary">
                    <div className="container">
                        <div className="dz-bnr-inr-entry">
                            <h1>Header Style 7</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={"#"}> Home</Link></li>
                                    <li className="breadcrumb-item">Header Style 7</li>
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
                            <CopySectionText code={HeaderSeven} />
<pre className="code-box" id="copyTarget">
    {HeaderSeven}   
</pre>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}