import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";

export default function AccountBillingAddress(){
    return(
		<>
			<div className="page-content bg-light">
				<CommanBanner image={IMAGES.BackBg1.src} mainText="Billing Address" parentText="Home" currentText="Billing Address" />
				<div className="content-inner-1">
					<div className="container">
						<div className="row">
							<CommanSidebar />
							<section className="col-xl-9 account-wrapper">
								<div className="account-card">
									<form className="row">
										<h3 className="m-b30">Billing address</h3>
										<div className="col-md-6">
											<div className="form-group m-b25">
												<label className="label-title">First Name</label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group m-b25">
												<label className="label-title">Last Name</label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group m-b25">
												<label className="label-title">Company name (optional)</label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
										<div className="col-md-12">
											<div className="m-b25">
												<label className="label-title">Country / Region <span className="text-danger">*</span></label>
												<select className="form-control">
													<option defaultValue="India">India</option>
													<option value="1">Another option</option>
													<option value="2">UK</option>
													<option value="3">Iraq</option>
												</select>	
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group m-b25">
												<label className="label-title">Street address <span className="text-danger">*</span></label>
												<input name="dzName" required className="form-control m-b15" placeholder="House number and street name" />
												<input name="dzName" required className="form-control" placeholder="Apartment, suite, unit, etc. (optional)" />
											</div>
										</div>
										<div className="col-md-12">
											<div className="m-b25">
												<label className="label-title">Town / City <span className="text-danger">*</span></label>
												<select className="form-control">
													<option defaultValue="Gandi Nagar">Gandi Nagar</option>
													<option value="1">Another option</option>
													<option value="2">Jaipur</option>
													<option value="3">Udaipur</option>
												</select>	
											</div>
										</div>
										<div className="col-md-12">
											<div className="m-b25">
												<label className="label-title">State<span className="text-danger">*</span></label>
												<select className="form-control">
													<option defaultValue="Gujrat">Gujrat</option>
													<option value="1">Another option</option>
													<option value="2">Rajasthan</option>
													<option value="3">Rajasthan</option>
												</select>	
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group m-b25">
												<label className="label-title">postcode<span className="text-danger">*</span></label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group m-b25">
												<label className="label-title">Phone<span className="text-danger">*</span></label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group m-b25">
												<label className="label-title">Email address <span className="text-danger">*</span></label>
												<input name="dzName" required className="form-control" />
											</div>
										</div>
									</form>
									<button className="btn btn-secondary">Save changes</button>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		</>
    )
}