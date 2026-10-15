"use client"

import Link from "next/link";
import IMAGES from "@/constant/theme";
import DetailListBlog from "@/elements/Portfolio/DetailListBlog";
import SwegarBlog from "@/elements/Portfolio/SwegarBlog";
import RelatedSlider from "@/elements/Portfolio/RelatedSlider";
import Image from "next/image";

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

interface CardImgtype{
    image : any
}

function GalleryCard(props : CardImgtype){
    return(
        <div className="col-xl-6 col-md-6 col-6 m-b30">
            <div className="dz-box portfolio-bx style-1">
                <div className="dz-media rounded">
                    <Link className="mfp-link lg-item GalleryCard DZoomImage" href={props.image.src} data-src={props.image.src}>
                        <i className="feather icon-maximize dz-maximize top-right"/>
                        <Image src={props.image} alt="" className=" d-none"/>
                    </Link>
                    <Image src={props.image} alt="portfolio" />
                </div>
            </div>
        </div>
    )
}

export default function PortfolioDetails1(){
    return(
        <div className="page-content bg-light">
            <div className="dz-bnr-inr bg-secondary">
                <div className="container">
                    <div className="dz-bnr-inr-entry text-start">
                        <h1>Make your fashion look <br/> mire charming</h1>
                        <nav aria-label="breadcrumb" className="breadcrumb-row">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                <li className="breadcrumb-item">Portfolio Details 1</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <section className="content-inner portfolio-detail-1" id="lightgallery">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 pe-xl-4 pe-lg-4 pe-auto">
                            <LightGallery 
                                plugins={[lgThumbnail, lgZoom]}
                                selector={'.DZoomImage'}
                            >
                                <div className="row">
                                    <GalleryCard image={IMAGES.PortfolioPic1}/>
                                    <GalleryCard image={IMAGES.PortfolioPic2}/>                                    
                                    <div className="col-xl-12 m-b30">
                                        <div className="dz-detail-box">
                                            <h2>Research & Planning</h2>
                                            <p className="m-b30">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
                                            <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. </p>
                                        </div>
                                    </div>
                                    <GalleryCard image={IMAGES.PortfolioPic3}/>
                                    <GalleryCard image={IMAGES.PortfolioPic4}/>
                                </div>
                            </LightGallery>
                        </div>
                        <div className="col-lg-4">
                            <div className="detail-list-box style-1 sticky-top">
                                <DetailListBlog />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <SwegarBlog />
            </div>
            <section className="content-inner-1 overflow-hidden releted-portfolio">
                <div className="container">
                    <div className="section-head style-2">
                        <div className="left-content">
                            <h2 className="title mb-0">Related Projects</h2>
                        </div>			
                    </div>
                    <div className="swiper-btn-center-lr">
                        <RelatedSlider />
                    </div>
                </div>
            </section>
        </div>
    )
}