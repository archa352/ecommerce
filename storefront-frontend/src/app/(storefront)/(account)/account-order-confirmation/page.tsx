import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import Image from "next/image";

export default function AccountOrderConfirm(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Order Confirmation" parentText="Home" currentText="Order Confirmation" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="confirmation-card account-card">
                                    <div className="thumb">
                                        <Image src={IMAGES.Confirmation} alt="confirm" />
                                    </div>
                                    <div className="text-center mt-4">
                                        <h4 className="mb-3 text-capitalize">Your Order Is Completed !</h4>
                                        <p className="mb-2">You will receive an order confirmation email with details of your order.</p>
                                        <p className="mb-0">Order ID: 267676GHERT105467</p>
                                        <div className="mt-4 d-sm-flex gap-3 justify-content-center">
                                            <Link href="/account-order-details" className="btn my-1 btn-secondary">View Order </Link>
                                            <Link href="/" className="btn btn-outline-secondary my-1 btnhover20">Back To Home </Link>
                                        </div>
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