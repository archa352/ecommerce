import Link from "next/link";
import IMAGES from "@/constant/theme";
import Image from "next/image";

export default function ShopOrderTracking(){
    return(
        <>
            <div className="page-content bg-light">
                <section className="px-3">
                    <div className="row align-center-center">
                        <div className="col-xxl-6 col-xl-6 col-lg-6 start-side-content">
                            <div className="dz-bnr-inr-entry">
                                <h1>Order Tracking</h1>
                                <nav aria-label="breadcrumb text-align-start" className="breadcrumb-row">
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href="#"> Home</Link></li>
                                        <li className="breadcrumb-item">Order Tracking</li>
                                    </ul>
                                </nav>	
                            </div>
                            <div className="registration-media">
                                <Image src={IMAGES.RegistrationPng2} alt="register" />
                            </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-content">
                            <div className="login-area">
                                <h2 className="text-secondary text-center">Track Your Order</h2>
                                <p className="text-center m-b30">welcome please login to your account</p>
                                <form>
                                    <div className="m-b30">
                                        <label className="label-title">Order ID</label>
                                        <input name="dzName" required className="form-control" placeholder="Found in your order confirmation email." type="text" />
                                    </div>
                                    <div className="m-b30">
                                        <label className="label-title">Billing email</label>
                                        <input name="dzName" required className="form-control" placeholder="Email you used during checkout." type="email" />
                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-secondary btnhover text-uppercase">Track</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>        
        </>
        
    )
}