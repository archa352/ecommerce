import Link from "next/link";
import IMAGES from "@/constant/theme";

import PasswordInputBox from "@/components/PasswordInputBox";
import Image from "next/image";


export default function Login(){    
    return(
        <div className="page-content bg-light">
            <section className="px-3">
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 start-side-content">
                        <div className="dz-bnr-inr-entry">
                            <h1>Login</h1>
                            <nav aria-label="breadcrumb text-align-start" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Login</li>
                                </ul>
                            </nav>	
                        </div>
                        <div className="registration-media">
                            <Image src={IMAGES.RegistrationPng3} alt="/" />
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
                        <div className="login-area">
                            <h2 className="text-secondary text-center">Login</h2>
                            <p className="text-center m-b25">welcome please login to your account</p>
                            <form>
                                <div className="m-b30">
                                    <label className="label-title">Email Address</label>
                                    <input name="dzName" required className="form-control" placeholder="Email Address" type="email" />
                                </div>
                                <div className="m-b15">
                                    <label className="label-title">Password</label>
                                    <div className="secure-input ">
                                        <PasswordInputBox placeholder="Password"/>
                                    </div>
                                </div>
                                <div className="form-row d-flex justify-content-between m-b30">
                                    <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
                                            <label className="form-check-label" htmlFor="basic_checkbox_1">Remember Me</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Link className="text-primary" href="/forget-password">Forgot Password</Link>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Link href="/account-dashboard" className="btn btn-secondary btnhover text-uppercase me-2 sign-btn">Sign In</Link>
                                    <Link href="/registration" className="btn btn-outline-secondary btnhover text-uppercase">Register</Link>
                                </div>
                            </form>
                        </div> 
                    </div>
                </div>
            </section>
        </div>
    )
}