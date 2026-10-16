"use client"
import Link from "next/link";
import IMAGES from "@/constant/theme";
import { useState } from "react";
import PasswordInputBox from "@/components/PasswordInputBox";
import Image from "next/image";

export default function ForgetPassword(){
    const [openReset, setOpenReset] = useState(false);
    return(
        <div className="page-content bg-light">
            <section className="px-3">
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 start-side-content">
                        <div className="dz-bnr-inr-entry">
                            <h1>Forgot Password</h1>
                            <nav aria-label="breadcrumb text-align-start" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Forgot Password</li>
                                </ul>
                            </nav>	
                        </div>
                        <div className="registration-media">
                            <Image src={IMAGES.RegistrationPng3} alt="/" />
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
                        
                        {openReset ?
                            <div className="forget-password-area" style={{display : "block"}}>
                                <h2 className="text-secondary text-center">Reset Password</h2>
                                <p className="text-center m-b25">Almost done, enter your new password and you're all set to go</p>
                                <form>
                                    <div className="m-b30">
                                        <label className="label-title">New Password</label>
                                        <div className="secure-input ">                                            
                                            <PasswordInputBox placeholder="New Password"/>
                                        </div>
                                    </div>
                                    <div className="m-b30">
                                        <label className="label-title">Confirm Password</label>
                                        <div className="secure-input ">                                            
                                            <PasswordInputBox placeholder="Confirm Password"/>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <Link href="/account-dashboard" className="btn btn-secondary btnhover text-uppercase sign-btn">Reset Password</Link>
                                    </div>
                                </form>
                            </div> 
                            :
                            <div className="login-area">
                                <h2 className="text-secondary text-center">Forgot Password</h2>
                                <p className="text-center m-b25">Enter your e-mail address below to reset your password.</p>
                                <form>
                                    <div className="m-b30">
                                        <label className="label-title">Email Address</label>
                                        <input name="dzName"  className="form-control" placeholder="Email Address" type="email" />
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <Link href="/login" className="btn btn-outline-secondary btnhover text-uppercase">Back</Link>
                                        <Link href="#" className="btn btn-secondary btnhover text-uppercase submit-btn form-toggle"
                                            onClick={()=>setOpenReset(true)}
                                        >Submit</Link>
                                    </div>
                                </form>
                            </div> 
                        }
				    </div>
                </div>
            </section>
        </div>
    )
}