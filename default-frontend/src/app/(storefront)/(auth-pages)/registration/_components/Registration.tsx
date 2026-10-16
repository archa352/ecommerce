import Link from "next/link";
import IMAGES from "@/constant/theme";
import PasswordInputBox from "@/components/PasswordInputBox";
import Image from "next/image";

export default function Registration(){
    return(
        <div className="page-content bg-light">
            <section className="px-3">
                <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 start-side-content">
                        <div className="dz-bnr-inr-entry">
                            <h1>Registration</h1>
                            <nav aria-label="breadcrumb text-align-start" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Registration</li>
                                </ul>
                            </nav>	
                        </div>
                        <div className="registration-media">
                            <Image src={IMAGES.RegistrationPng3} alt="/" />
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 end-side-content justify-content-center">
                        <div className="login-area">
							<h2 className="text-secondary text-center">Registration Now</h2>
							<p className="text-center m-b30">Welcome please registration to your account</p>
							<form>
								<div className="m-b25">
									<label className="label-title">Username</label>
									<input name="dzName" required className="form-control" placeholder="Username" type="text" />
								</div>
								<div className="m-b25">
									<label className="label-title">Email Address</label>
									<input name="dzName" required className="form-control" placeholder="Email Address" type="email" />
								</div>
								<div className="m-b40">
									<label className="label-title">Password</label>
									<div className="secure-input ">										
										<PasswordInputBox placeholder="Password"/>
									</div>
								</div>
								<div className="text-center">
									<Link href="/registration" className="btn btn-secondary btnhover text-uppercase me-2">Register</Link>
									<Link href="/login" className="btn btn-outline-secondary btnhover text-uppercase">Sign In</Link>
								</div>
							</form>
						</div>
                    </div>
                </div>
            </section>
        </div>
    )
}