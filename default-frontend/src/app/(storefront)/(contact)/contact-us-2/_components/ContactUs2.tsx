"use client"
import {Nav, Tab} from 'react-bootstrap';

import IMAGES from "@/constant/theme";
import ContactFormBlog from "@/elements/ContactFormBlog";
import { useEffect } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const ContactUs2 = () => {	
	// let path = useLocation().pathname
	let path = usePathname();
		
	useEffect(()=>{		
		if(path === "/contact-us-2"){
			document.body.classList.add('bg-light');
		}else{
			document.body.classList.remove('bg-light');
		}		
	},[])
    return (
       <div className="page-content">
			<section className="bg-light content-inner-1 m-t70 contact-us2 overflow-hidden">
				<div className="container">
					<div className="row">
						<Tab.Container defaultActiveKey={'Address1'}>
							<div className="map-fixed">
								<div className="contact-map">
									<Image src={IMAGES.MapPngImg} alt="mappng" />
									<nav>
										<Nav as="div" className="map-point" id="nav-tab" role="tablist">
											<Nav.Link  eventKey={'Address1'} className="point point-1 p-0"></Nav.Link>
											<Nav.Link  eventKey={'Address2'} className="point point-2 p-0"></Nav.Link>
											<Nav.Link  eventKey={'Address3'} className="point point-3 p-0"></Nav.Link>
										</Nav>
									</nav>
								</div>
								<div className="dz-text wow fadeInUp" data-wow-delay="0.5s">Contact Us</div>
							</div>
							<div className="col-xl-5 col-md-7">
								<Tab.Content>
									<Tab.Pane  eventKey={'Address1'}>
										<div className="contact-info style-1 text-start text-white">
											<h2 className="title wow fadeInUp" data-wow-delay="0.1s">United States</h2>
											<p className="text wow fadeInUp" data-wow-delay="0.2s"><span>Address:</span> 3553 Brandywine Street Northwest, Washington AR 20008</p>
											<div className="contact-bottom wow fadeInUp justify-content-between" data-wow-delay="0.3s">
												<div className="contact-left">
													<h3>Call Us</h3>
													<ul>
														<li>+01-123-456-7890</li>
														<li>+01-123-456-7890</li>
													</ul>
												</div>
												<div className="contact-right">
													<h3>Email Us</h3>
													<ul>
														<li>help@Pixio.com</li>
													</ul>
												</div>		
											</div>
										</div>
									</Tab.Pane>
									<Tab.Pane  eventKey={'Address2'}>
										<div className="contact-info style-1 text-start text-white">
											<h2 className="title wow fadeInUp" data-wow-delay="0.1s">South Africa</h2>
											<p className="text wow fadeInUp" data-wow-delay="0.2s"><span>Address:</span> 552 Church St</p>
											<div className="contact-bottom wow fadeInUp justify-content-between" data-wow-delay="0.3s">
												<div className="contact-left">
													<h3>Call Us</h3>
													<ul>
														<li>+01-123-456-7890</li>
														<li>+01-123-456-7890</li>
													</ul>
												</div>
												<div className="contact-right">
													<h3>Email Us</h3>
													<ul>
														<li>help@Pixio.com</li>
													</ul>
												</div>		
											</div>
										</div>
									</Tab.Pane>
									<Tab.Pane   eventKey={'Address3'}>
										<div className="contact-info style-1 text-start text-white">
											<h2 className="title wow fadeInUp" data-wow-delay="0.1s">Russia</h2>
											<p className="text wow fadeInUp" data-wow-delay="0.2s"><span>Address:</span> Ryabikova B-R, bld. 20/А, appt. 151</p>
											<div className="contact-bottom wow fadeInUp justify-content-between" data-wow-delay="0.3s">
												<div className="contact-left">
													<h3>Call Us</h3>
													<ul>
														<li>+01-123-456-7890</li>
														<li>+01-123-456-7890</li>
													</ul>
												</div>
												<div className="contact-right">
													<h3>Email Us</h3>
													<ul>
														<li>help@Pixio.com</li>
													</ul>
												</div>		
											</div>
										</div>
									</Tab.Pane>
								</Tab.Content>
								<div className="contact-area1 wow fadeInUp" data-wow-delay="0.4s">								
									<ContactFormBlog />
								</div>
							</div>
						</Tab.Container>
					</div>
				</div>
			</section>
		</div>
    );
};

export default ContactUs2;