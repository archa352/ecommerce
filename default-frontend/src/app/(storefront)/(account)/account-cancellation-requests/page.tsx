import Link from "next/link";
import Image from "next/image";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";

export default function AccountCancellationRequests() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Cancellation Requests" parentText="Home" currentText="Cancellation Requests" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="row">
                                    <div className="col-md-6 m-b30">
                                        <div className="order-cancel-card">
                                            <div className="order-head">
                                                <h6 className="mb-0">Request No: <span className="text-primary">#1374837</span></h6>
                                            </div>
                                            <Link href="/account-return-request-detail" className="order-cancel-box">
                                                <div className="cancel-media">
                                                    <Image src={IMAGES.ShopSmallPic1} alt="small" />
                                                </div>
                                                <div className="order-cancel-content">
                                                    <span>March 21, 2025</span>
                                                    <h5 className="title mb-0">Collar Casual Shirt</h5>
                                                    <p className="mb-2">Quantity: <strong className="text-black">1</strong></p>
                                                    <h6 className="mb-0">$105</h6>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6 m-b30">
                                        <div className="order-cancel-card">
                                            <div className="order-head">
                                                <h6 className="mb-0">Request No: <span className="text-primary">#1374837</span></h6>
                                            </div>
                                            <Link href="/account-return-request-detail" className="order-cancel-box">
                                                <div className="cancel-media">
                                                    <Image src={IMAGES.ShopSmallPic2} alt="small" />
                                                </div>
                                                <div className="order-cancel-content">
                                                    <span>March 21, 2025</span>
                                                    <h5 className="title mb-0">Collar Casual Shirt</h5>
                                                    <p className="mb-2">Quantity: <strong className="text-black">1</strong></p>
                                                    <h6 className="mb-0">$304</h6>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 m-b30">
                                        <h4>Reason For Cancellation</h4>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1"> I have changed my mind</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2"> Expected delivery time is very long</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault3"> I want to change address for the order</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault4" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault4"> I want to convert my order to Prepaid</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault5" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault5"> Price for the product has decreased</label>
                                        </div>
                                        <div className="custom-control custom-checkbox mb-1">
                                            <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault6" />
                                            <label className="form-check-label" htmlFor="flexRadioDefault6"> I have purchased the product elsewhere</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Refund status</h4>
                                        <p>There will be no refund as the order is purchased using Cash-On-Delivery</p>
                                        <Link href="/account-refund-requests-confirmed" className="btn btn-secondary me-xl-3 me-2 btnhover20">Submit Request</Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}