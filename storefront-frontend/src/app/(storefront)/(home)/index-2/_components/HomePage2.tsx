"use client"
import { useState } from "react";
import Link from 'next/link';
// import "../assets/css/skin/skin-1.css"
import {Modal} from 'react-bootstrap'

import Header2 from "@/components/Header2";
import Footer from "@/components/Footer";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import FeatureSection from "@/elements/Home2/FeatureSection";
import MainSliderIndex2 from "@/elements/Home2/MainSliderIndex2";
import VideoSection from "@/elements/Home2/VideoSection";
import TrandingSlider from "@/elements/Home2/TrandingSlider";
import ProductSection from "@/elements/Home/ProductSection";
import {TagSliderOne, TagSliderTwo } from "@/elements/Home2/TagSliderOne";
import PartnerRollup from "@/elements/Home2/PartnerRollup";
import BlogPostSection from "@/elements/Home2/BlogPostSection";
import FeatureBoxSection from "@/elements/Home2/FeatureBoxSection";

const HomePage2 = () =>{
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
      <>
        <div className="page-wraper">
            <Header2 />
            <div className="page-content bg-light">
                <MainSliderIndex2 />
                <div className="content-inner category-section">
                    <FeatureSection />
                </div>
                <section className="content-inner-1 overflow-hidden">
                    <div className="container">
                        <div className="row justify-content-md-between align-items-center">
                            <div className="col-lg-6 col-md-8 col-sm-12">
                                <div className="section-head style-1 m-b30 wow fadeInUp" data-wow-delay="0.2s">
                                    <div className="left-content">
                                        <h2 className="title">What's trending now</h2>
                                        <p>Discover the most trending products in Pixio.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-4 col-sm-12 text-md-end">
                                <Link className="btn btn-secondary m-b30" href="/shop-cart">View All</Link>
                            </div>
                        </div>
                        <div className="swiper-btn-center-lr">
                            <TrandingSlider 
                                showdetailModal={()=>setDetailModal(true)}
                            />
                        </div>
                    </div>
                </section>
                <section className="video-section">
                    <VideoSection />
                </section>
                <section className="content-inner">
                    <div className="container">
                        <ProductSection />
                    </div>
                </section>
                <section className="content-inner-3 companies-section overflow-hidden">
                    <div className="container">
                        <div className="row justify-content-between align-items-end">
                            <div className="col-lg-8 col-md-8 col-sm-12">
                                <div className="section-head style-2 wow fadeInUp m-0" data-wow-delay="0.1s">
                                    <h2 className="title text-white">We’re just keep growing  with 6.3k trusted companies</h2>
                                </div>	
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 text-md-center m-b30 wow fadeInUp" data-wow-delay="0.2s">	
                                <Link className="icon-button d-md-inline-block d-none" href="/blog-tag">
                                    <div className="text-row word-rotate-box c-black border-secondary bg-secondary">
                                        <PartnerRollup />
                                        <svg className="badge__emoji" xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
                                            <path d="M85.9974 27.7066L78.4547 15.2934L50.56 30.5869V0H35.44V30.5869L7.54534 15.2934L0 27.7066L27.9018 43L0.00212688 58.2934L7.5451 70.7066L35.44 55.4131V86H50.56V55.4131L78.4544 70.7066L86 58.2934L58.0982 43L85.9974 27.7066Z" fill="#FAFAF8"/>
                                        </svg>
                                    </div>
                                </Link>
                            </div>	
                        </div>
                    </div>	
                    <div className="container-fluid">
                        <div className="tag-slider-wrapper tag-slider style-1 wow fadeInUp" data-wow-delay="0.2s" id="tagSlider">                        
                            <TagSliderOne/>
                        </div>
                        <div className="tag-slider-wrapper tag-slider wow fadeInUp" data-wow-delay="0.4s" id="tagSlider2">
                            <TagSliderTwo />                            
                        </div>
                    </div>
                </section>
                <section className="content-inner">
                    <div className="container">
                        <div className="section-head style-1 wow fadeInUp d-md-flex justify-content-between align-items-center" data-wow-delay="0.1s">
                            <div className="left-content">
                                <h2 className="title">latest Post</h2>
                                <p>Discover the most trending products in Pixio.</p>
                            </div>
                            <Link className="btn btn-secondary " href="/blog-archive">View All</Link>			
                        </div>
                        <BlogPostSection />	
                    </div>
                </section>	
                <div className="content-inner py-0  image-wrapper">
                    <div className="container-fluid px-0">
                        <FeatureBoxSection />
                    </div>
                </div>
            </div> 
            <Footer footerStyle="bg-light"/> 
        </div>

        {/* Comman Modal */}
        <Modal className="quick-view-modal" centered
            show={detailModal} onHide={()=>setDetailModal(false)}
        >              
            <button type="button" className="btn-close" onClick={()=>setDetailModal(false)}>
                <i className="icon feather icon-x"/>
            </button>
            <div className="modal-body">
                <div className="row g-xl-4 g-3">
                    <div className="col-xl-6 col-md-6">
                        <div className="dz-product-detail mb-0">
                            <div className="swiper-btn-center-lr">
                                <ModalSlider />
                            </div>	
                        </div>	
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <BasicModalData />
                    </div>
                </div>
            </div>
                            
        </Modal>
      </>
    )
}
export default HomePage2;