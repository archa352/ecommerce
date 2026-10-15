"use client"
import Link from "next/link";
import PasswordInputBox from "@/components/PasswordInputBox";

/**
 * The reset-password half of the template's forgot/reset flow (see
 * ForgetPassword.tsx) -- new/confirm password fields, no live backend.
 */
export default function ResetPassword(){
    return(
        <div className="page-content bg-light">
            <section className="px-3">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
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
                    </div>
                </div>
            </section>
        </div>
    )
}
