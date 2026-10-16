"use client"
import Link from "next/link";
import IMAGES from "../../constant/theme";
import MoreCollectionBlog from "../Home/MoreCollectionBlog";
import Image from "next/image";

interface modelType{
	OpenVideo? : (() => void | undefined) | undefined;
}

export default function MainBanner3({OpenVideo} : modelType){
    return(
        <div className="main-slider style-3"> 
			<div className="container">
				<div className="banner-content">
					<div className="row gx-0">
						<div className="col-md-12 col-lg-8 align-self-center">
							<div className="inner-content">
								<div className="content-info">
									<h1 className="title mb-4 wow flipInX animated" data-wow-delay="0.5s">Make your fashion look mire <span>charming</span></h1>
									<p className="text" data-swiper-parallax="-40">Sell globally in minutes with localized currencies, languages, 
										and experiences in every market.  </p>
									<div className="content-btn m-b30 wow fadeInUp" data-wow-delay="0.8s" data-swiper-parallax="-60">
										<Link  className="btn btn-secondary btn-lg  me-xl-3 me-2 btnhover20" href="/shop-cart">ADD TO CART</Link>
										<Link  className="btn btn-outline-secondary btn-lg btnhover20" href="/shop-standard">VIEW DETAILS</Link>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-12 col-md-6 col-lg-5 mb-3 wow fadeInUp" data-wow-delay="0.1s">
									<div className="product-card">
										<div className="dz-media">
											<Image src={IMAGES.ShopSmallPic1} alt="/"/>									
										</div>
										<div className="dz-content">
											<h5 className="dz-title"><Link href="/shop-standard">Collar Casual Shirt</Link></h5>
											<span className="price">
												$19
												<del className="ms-1">$27</del>
											</span>
										</div>
									</div>
								</div>
								<div className="col-sm-12 col-md-6 col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
									<div className="product-card">
										<div className="dz-media">
											<Image src={IMAGES.ShopSmallPic2} alt="shop"/>									
										</div>
										<div className="dz-content">
											<h5 className="dz-title"><Link href="/shop-standard">Collar Check Shirt</Link></h5>
											<span className="price">
												$20
												<del className="ms-1">$28</del>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-12 col-lg-4">
							<div className="banner-media">
								<div className="img-preview wow slideInRight" data-wow-delay="0.1s" data-wow-duration="1.5s">
									<Image src={IMAGES.Bannermedia3} alt="banner-media"/>
								</div>
								<Link href={"#"} className="icon-button popup-youtube" 									
									onClick={OpenVideo}
								>
									<div className="text-row word-rotate-box c-black blur">
                                        <MoreCollectionBlog />
										<i className="fa-solid fa-play text-dark badge__emoji" ></i>
									</div>
								</Link>
								<div className="star">
									<svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
									<path d="M34 0L43.6167 24.3833L68 34L43.6167 43.6167L34 68L24.3833 43.6167L0 34L24.3833 24.3833L34 0Z" fill="black"/>
								  </svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="collection1"><Image src={IMAGES.CollectionPng1} alt="collection1"/></div>
			<div className="collection2"><Image src={IMAGES.CollectionPng2} alt="collection2"/></div>
			<div className="collection3"><Image src={IMAGES.CollectionPng3} alt="collection3"/></div>
		</div>
    )
}