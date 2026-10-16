import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import Image from "next/image";

interface customertype{
    image: string
}
const CustomerImage : customertype[] = [
    { image: IMAGES.Testimonial1,}, { image: IMAGES.Testimonial2,}, { image: IMAGES.Testimonial3,}
];

export default function MainSliderIndex2(){
    return(
        <div className="main-slider style-2"> 
			<div className="main-swiper2">
				<div className="container">
					<div className="banner-content">
						<div className="row">
							<div className="col-xl-7 col-lg-7 col-md-12 align-self-center">
								<div className="swiper-content">
									<div className="content-info">
										<h1 className="offer-title mb-0" data-swiper-parallax="-20">Your Ultimate <span className="text-primary d-flex align-items-center"><svg className="m-r10" xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
											<path d="M34 0L43.6167 24.3833L68 34L43.6167 43.6167L34 68L24.3833 43.6167L0 34L24.3833 24.3833L34 0Z" fill="var(--primary)"/>
										  </svg> Online Store</span>for All Your Needs.</h1>
										<p className="sub-title mb-0" data-swiper-parallax="-40">No code need. Plus free shippng on <span>$99+</span> orders!</p>												
									</div>
									<div className="content-btn" data-swiper-parallax="-60">
										<Link className="btn btn-secondary me-3" href="/shop-cart">ADD TO CART</Link>
										<Link className="btn btn-outline-secondary" href="/shop-standard">VIEW DETAILS</Link>
									</div>
								</div>
                            </div>
							<div className="col-xl-5 col-lg-5 col-md-12">
								<div className="banner-media">
									<div className="shap"></div>
									<div className="border-shap"></div>
									<div className="border-shap2"></div>
									<div className="img-preview" data-swiper-parallax="-100">
										<Image src={IMAGES.MainSliider2} alt="banner-media" />
									</div>
									<div className="bnr-content-bx slideskew">
										<div className="dz-media">
											<Image src={IMAGES.ProductSmall1} alt="shirt" />
										</div>
										<div className="dz-info">
											<h5 className="dz-title">Cozy Knit Cardigan</h5>
											<h6 className="price text-primary">$80</h6>
											<div className="btn btn-primary meta-icon dz-carticon">
												<i className="flaticon flaticon-basket"/>
												<i className="flaticon flaticon-basket-on dz-heart-fill"/>
											</div>
										</div>
									</div>
									<div className="bnr-customer-bx slideskew">
										<i className="icon feather icon-heart-on dz-heart"></i>
										<ul>
                                            {CustomerImage.map((elem, i)=>(
                                                <li className="customer-image" key={(i)}>
                                                    <Image src={elem.image} alt="testimonial" />
                                                </li>
                                            ))}											
										</ul>
									</div>
									<ul className="star-list">
										<li className="star-1" dangerouslySetInnerHTML={{__html : SVGICON.StarPink}} />
										<li className="star-2" dangerouslySetInnerHTML={{__html : SVGICON.StarPink}} />
										<li className="star-3" dangerouslySetInnerHTML={{__html : SVGICON.StarPink}} />										
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="banner-social-media style-2 left">
					<ul>
						<li>
							<Link href="https://www.instagram.com/dexignzone/" target="_blank">Instagram</Link>
						</li>
						<li>
							<Link href="https://www.facebook.com/dexignzone" target="_blank">Facebook</Link>
						</li>
						<li>
							<Link href="https://twitter.com/dexignzones" target="_blank">twitter</Link>
						</li>
					</ul>
				</div>
				<Link href="/contact-us-2" className="service-btn btn-dark">Let’s talk</Link>
			</div>
		</div>	
    )
}