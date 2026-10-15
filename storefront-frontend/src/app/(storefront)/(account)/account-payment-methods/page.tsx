import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import Image from "next/image";

export default function AccountPaymentMethods() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Review" parentText="Home" currentText="Review" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="account-card">
                                    <form action="#">
                                        <div className="row m-b30">
                                            <div className="col-md-12">
                                                <h4 className="title m-b15 text-capitalize">Payment Methods</h4>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="custom-control style-1">
                                                    <input className="form-check-input radio" type="radio" name="Methods1" id="Methods5" />
                                                    <label className="custom-checkbox form-check-label payment" htmlFor="Methods5">
                                                        <Image src={IMAGES.PaymentPaypal} alt="/" />
                                                        <span>
                                                            <span className="title">Paypal</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="custom-control style-1">
                                                    <input className="form-check-input radio" type="radio" name="Methods1" id="Methods6" />
                                                    <label className="custom-checkbox form-check-label payment" htmlFor="Methods6">
                                                        <Image src={IMAGES.PaymentdDebit}  alt="/" />
                                                        <span>
                                                            <span className="title">Credit or Debit Card</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="custom-control style-1">
                                                    <input className="form-check-input radio" type="radio" name="Methods1" id="Methods7" />
                                                    <label className="custom-checkbox form-check-label payment" htmlFor="Methods7">
                                                        <Image src={IMAGES.PaymentdBank}  alt="/" />
                                                        <span>
                                                            <span className="title">Direct bank Transfer</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="custom-control style-1">
                                                    <input className="form-check-input radio" type="radio" name="Methods1" id="Methods8" />
                                                    <label className="custom-checkbox form-check-label payment" htmlFor="Methods8">
                                                        <Image src={IMAGES.PaymentdCash}  alt="/" />
                                                        <span>
                                                            <span className="title">Cash on Delivery</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group m-b25">
                                                    <label className="label-title">Card Number</label>
                                                    <input type="number" name="dzNumber" required className="form-control" placeholder="1234 4567 8910 1112" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group m-b25">
                                                    <label className="label-title">Expiry Date</label>
                                                    <input type="date" required className="form-control" aria-label="calendar outline" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group m-b25">
                                                    <label className="label-title">CVC/CVV</label>
                                                    <input type="number" required className="form-control" placeholder="1234" />
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/account-order-confirmation" className="btn btn-secondary mt-2">Confirm Order</Link>
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