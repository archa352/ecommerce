import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import { ReturnReqData } from "@/constant/Alldata";
import Image from "next/image";

export default function AccountReturnRequest() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Return Request" parentText="Home" currentText="Return Request" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="row">
                                    <div className="col-12 m-b30">
                                        <h3 className="mb-0">REQUEST FOR PRODUCT RETURN (2)</h3>
                                    </div>
                                    {ReturnReqData.map((elem, index)=>(
                                        <div className="col-lg-6 m-b30" key={index}>
                                            <div className="order-cancel-card">
                                                <div className="order-head">
                                                    <h6 className="mb-0">Request No: <span className="text-primary">{elem.requestno}</span></h6>
                                                    <Link href={"#"} 
                                                        className={`btn-link text-underline ${elem.status === "Return Made" ? "text-success" : "text-danger"}`}>
                                                        {elem.status}
                                                    </Link>
                                                </div>
                                                <Link href="/account-return-request-detail" className="order-cancel-box">
                                                    <div className="cancel-media">
                                                        <Image src={elem.image} alt="small" />
                                                    </div>
                                                    <div className="order-cancel-content">
                                                        <span>May 30, 2025</span>
                                                        <h5 className="title mb-0">{elem.name}</h5>
                                                        <p className="mb-2">Quantity: <strong className="text-black">1</strong></p>
                                                        <h6 className="mb-0">{elem.price}</h6>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}                                
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}