import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";

export default function AccountRefundRequestConfirm() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Refund Requests Confirmed" parentText="Home" currentText="Refund Requests Confirmed" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="account-card confirmed-request text-center">
                                    <div className="cancel-btn m-auto mb-sm-4 mb-2"><i className="fa-solid fa-check"/></div>
                                    <h2>Cancellation Confirmed</h2>
                                    <Link className="btn btn-outline-secondary btn-lg btnhover20 m-t15" href="/account-order-details">Check Status</Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}