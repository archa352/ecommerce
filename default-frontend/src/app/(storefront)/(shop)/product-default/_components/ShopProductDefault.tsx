"use client"
import Link from "next/link";
import { Modal } from "react-bootstrap";
import BestOfferBlog from "@/elements/Shop/BestOfferBlog";
import ProductDefaultSlider from "@/elements/Shop/ProductDefaultSlider";
import ProductDescription from "@/elements/Shop/ProductDescription";
import ShopProductRightContent from "@/elements/Shop/ShopProductRightContent";
import TrandingSlider from "@/elements/Home2/TrandingSlider";
import { useState } from "react";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";

export default function ShopProductDefault(){
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
        <>
            <div className="page-content bg-light">
                <div className="d-sm-flex justify-content-between container-fluid py-3">
                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                        <ul className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                            <li className="breadcrumb-item">Product Default</li>
                        </ul>
                    </nav>
                </div>
                <section className="content-inner py-0">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-4 col-md-4">
                                <div className="dz-product-detail sticky-top">
                                    <ProductDefaultSlider />						
                                </div>	
                            </div>
                            <div className="col-xl-8 col-md-8">
                                <div className="row">
                                    <div className="col-xl-7">
                                        <ShopProductRightContent />
                                    </div>
                                    <div className="col-xl-5">
                                        <BestOfferBlog />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner-3 pb-0"> 
                    <div className="container">
                        <div className="product-description">
                            <ProductDescription />
                        </div>
                    </div>
                </section>
                <section className="content-inner-1  overflow-hidden">
                    <div className="container">
                        <div className="section-head style-2 d-md-flex justify-content-between align-items-center">
                            <div className="left-content">
                                <h2 className="title mb-0">Related products</h2>
                            </div>
                            <Link href="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1">See all products
                                <i className="icon feather icon-chevron-right font-18" />
                            </Link>			
                        </div>
                        <div className="swiper-btn-center-lr">
                            <TrandingSlider 
                                showdetailModal={()=>setDetailModal(true)}
                            />
                            <div className="pagination-align">
                                <div className="tranding-button-prev btn-prev">
                                    <i className="flaticon flaticon-left-chevron" />
                                </div>
                                <div className="tranding-button-next btn-next">
                                    <i className="flaticon flaticon-chevron" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
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