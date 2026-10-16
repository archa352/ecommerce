import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import { ReviewBlogData } from "@/constant/Alldata";
import Image from "next/image";


export default function AccountReview() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Payment Methods" parentText="Home" currentText="Payment Methods" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="row">
                                    {ReviewBlogData.map((elem, ind)=>(
                                        <div className="col-md-6 m-b30" key={ind}>
                                            <div className="review-card">
                                                <div className="review-head">
                                                    <div className="review-media">
                                                        <Image src={elem.image} alt={elem.name} />
                                                    </div>
                                                    <div className="clearfix">
                                                        <h5 className="mb-0">{elem.name}</h5>
                                                        <div className="star-rating">
                                                            <i className="fa fa-star text-yellow me-1"/>
                                                            <i className="fa fa-star text-yellow me-1"/>
                                                            <i className="fa fa-star text-yellow me-1"/>
                                                            <i className="fa fa-star text-yellow me-1"/>
                                                            <i className="fa fa-star text-yellow"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
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