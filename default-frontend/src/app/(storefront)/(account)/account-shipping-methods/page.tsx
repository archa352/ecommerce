import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import Image from "next/image";

export default function AccountShippingMethods() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Shipping Methods" parentText="Home" currentText="Shipping Methods" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="account-card">
                                    <form className="row g-3">
                                        <div className="col-md-12">
                                            <h4 className="title m-b15 text-capitalize">Shipping Methods</h4>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom-control style-1 style-thumb mb-0">
                                                <input className="form-check-input radio" type="radio" name="Methods1" id="Methods1" />
                                                <label className="custom-checkbox form-check-label" htmlFor="Methods1">
                                                    <Image className="thumb" src={IMAGES.Paymentfedex} alt="/" />
                                                    <span>
                                                        <span className="title">FedEx,</span>
                                                        <span className="text">Delivery, Tomorrow</span>
                                                    </span>
                                                    <span className="price">$0.99</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom-control style-1 style-thumb mb-0">
                                                <input className="form-check-input radio" type="radio" name="Methods1" id="Methods2" />
                                                <label className="custom-checkbox form-check-label" htmlFor="Methods2">
                                                    <Image className="thumb" src={IMAGES.Paymentamerican} alt="/" />
                                                    <span>
                                                        <span className="title">American</span>
                                                        <span className="text">Delivery, Today</span>
                                                    </span>
                                                    <span className="price">$0.99</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom-control style-1 style-thumb mb-0">
                                                <input className="form-check-input radio" type="radio" name="Methods1" id="Methods3" />
                                                <label className="custom-checkbox form-check-label" htmlFor="Methods3">
                                                    <Image className="thumb" src={IMAGES.Paymentdhl} alt="/" />
                                                    <span>
                                                        <span className="title">DHL Express</span>
                                                        <span className="text">Delivery, Today</span>
                                                    </span>
                                                    <span className="price">$0.99</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="custom-control style-1 style-thumb mb-0">
                                                <input className="form-check-input radio" type="radio" name="Methods1" id="Methods4" />
                                                <label className="custom-checkbox form-check-label" htmlFor="Methods4">
                                                    <Image className="thumb" src={IMAGES.Paymentdretrieve} alt="/" />
                                                    <span>
                                                        <span className="title">DHL Express</span>
                                                        <span className="text">Delivery, Today</span>
                                                    </span>
                                                    <span className="price">$0.99</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Link href="/account-payment-methods" className="btn btn-secondary mt-2">Continue to payment</Link>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}