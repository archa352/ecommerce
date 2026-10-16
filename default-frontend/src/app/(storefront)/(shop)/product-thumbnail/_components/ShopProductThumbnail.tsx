"use client"

import Link from "next/link";
import { Modal, Nav, Tab } from "react-bootstrap";
import TrandingSlider from "@/elements/Home2/TrandingSlider";
import { useState } from "react";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import Comments from "@/elements/Post/Comments";
import IMAGES from "@/constant/theme";
import ProudctThumbNailSlider from "@/elements/Shop/ProudctThumbNailSlider";
import ThumbnailRightProductDetail from "@/elements/Shop/ThumbnailRightProductDetail";
import Image from "next/image";

export default function ShopProductThumbnail(){
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
        <>
            <div className="page-content bg-light">            
                <div className="d-sm-flex justify-content-between container-fluid py-3">
                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                        <ul className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                            <li className="breadcrumb-item">Product Thumbnail</li>
                        </ul>
                    </nav>
                </div>
                <section className="content-inner py-0">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-6 col-md-6">
                                <div className="dz-product-detail sticky-top">
                                    <div className="swiper-btn-center-lr">
                                        <ProudctThumbNailSlider />   
                                    </div>	
                                </div>	
                            </div>
                            <div className="col-xl-6 col-md-6">
                                <div className="dz-product-detail style-2 p-t50">
                                    <ThumbnailRightProductDetail 
                                        title="Women Red & White Striped Crepe Top" 
                                        para="This comfortable cotton crop-top features the Divi Engine logo on the front expressing how easy “data Divi Engine life” is. It is the perfect tee for any occasion."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner-3 pb-0"> 
                    <div className="container">
                        <div className="product-description">
                            <Tab.Container defaultActiveKey={"description"}>
                                <div className="dz-tabs">					
                                    <Nav as="ul" className="nav-tabs center">
                                        <Nav.Item as="li">
                                            <Nav.Link as="button" eventKey={"description"}>Description</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li">
                                            <Nav.Link as="button" eventKey={"review"}>Reviews (12)</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                        <Tab.Pane eventKey={"description"}>
                                            <div className="row">
                                                <div className="col-lg-6 m-lg-b0 m-md-b30">
                                                    <div className="section-head style-2 d-block">
                                                        <h2 className="title">Fits women</h2>
                                                        <p>Designed for superior child comfort, OneFit™ provides extra rear-facing legroom and multiple recline options in every mode of use. With the widest range of height adjustments, the easy-adjust headrest system adjusts with the harness to grow with your child. OneFit™ accommodates tiny passengers from the very start with a removable head and body support insert for newborns weighing 5-11 lbs.		</p>
                                                    </div>
                                                    <div className="product-specification">
                                                        <h4 className="specification-title">Specifications</h4>
                                                        <ul>
                                                            <li>Assembled Dimensions (L x W x H): <span>71.1 x 45.7 x 7.6 cm; 700 Grams</span></li>
                                                            <li>Assembled Product Weight: <span>25 lbs.</span></li>
                                                        </ul>
                                                    </div>
                                                    <ul className="specification-list m-b40">
                                                        <li className="list-info">Manufacturer <span>Indra Hosiery Mills</span></li>
                                                        <li className="list-info">ASIN<span>B07WK128569</span></li>
                                                        <li className="list-info">Country of Origin<span>India</span></li>
                                                        <li className="list-info">Department<span>Women</span></li>
                                                        <li className="list-info">Included Components<span>Women's Jacket</span></li>
                                                        <li className="list-info">Item Dimensions LxWxH<span> 71.1 x 45.7 x 7.6 Centimeters</span></li>
                                                        <li className="list-info">Manufacture<span> Indra Hosiery Mills</span></li>
                                                    </ul>
                                                    <div className="product-media row g-xl-4 g-2 m-b40">
                                                        <div className="col-md-3 col-3 col-sm-3 product-media-inner">
                                                            <Link href="/shop-list" className="dz-media">
                                                                <Image src={IMAGES.ProductDress1} alt="/" />
                                                            </Link>
                                                        </div>
                                                        <div className="col-md-3 col-3 col-sm-3 product-media-inner">
                                                            <Link href="/shop-list" className="dz-media">
                                                                <Image src={IMAGES.ProductDress2} alt="/" />
                                                            </Link>
                                                        </div>
                                                        <div className="col-md-3 col-3 col-sm-3 product-media-inner">
                                                            <Link href={"/shop-list"} className="dz-media">
                                                                <Image src={IMAGES.ProductDress3} alt="/" />
                                                            </Link>
                                                        </div>
                                                        <div className="col-md-3 col-3 col-sm-3 product-media-inner">
                                                            <Link href="/shop-list" className="dz-media">
                                                                <Image src={IMAGES.ProductDress4} alt="/" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="product-info">
                                                        <div className="product-info-inner">
                                                            <h4 className="info-title">Fabric Content</h4>
                                                            <ul className="d-lg-flex d-block align-items-center">
                                                                <li><h6>Seatpad: <span>100% Cotton</span></h6></li>
                                                                <li><h6>Insert: <span>100% Cotton</span></h6></li>
                                                            </ul>
                                                        </div>
                                                        <div className="product-info-inner">
                                                            <h4 className="info-title">Chemical Statement</h4>
                                                            <p className="info-text">The OneFit ClearTex All-In-One Car Seat is produced without the use of intentionally added fire retardant chemical treatments, PFAS, BPA and phthalates.	</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 m-sm-b20 m-b30">
                                                            <Link href="/shop-standard" className="about-product-wrapper">
                                                                <div className="producṭ-content bg-light">
                                                                    <h4 className="product-title">All-in-One Dress</h4>
                                                                    <p className="product-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 m-sm-b20 m-b30">
                                                            <Link href="/shop-standard" className="about-product-wrapper">
                                                                <div className="producṭ-content bg-light">
                                                                    <h4 className="product-title">Looking wise good</h4>
                                                                    <p className="product-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 m-sm-b20 m-b30">
                                                            <Link href="/shop-standard" className="about-product-wrapper">
                                                                <div className="producṭ-content bg-light">
                                                                    <h4 className="product-title">100% Made In India</h4>
                                                                    <p className="product-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 m-sm-b20 m-b30">
                                                            <Link href="/shop-standard" className="about-product-wrapper">
                                                                <div className="producṭ-content bg-light">
                                                                    <h4 className="product-title">100% Cotton</h4>
                                                                    <p className="product-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="dz-product-media dz-media rounded">
                                                        <Image src={IMAGES.ProductDetailStyle1Png1} alt="/" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={"review"}>                                            
                                            <Comments />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                        </div>
                    </div>
                </section>
                <section className="content-inner-1  overflow-hidden">
                    <div className="container">
                        <div className="section-head style-2 d-md-flex align-items-center justify-content-between">
                            <div className="left-content">
                                <h2 className="title mb-0">Related products</h2>
                            </div>
                            <Link href="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1">See all products
                                <i className="icon feather icon-chevron-right font-18"/>
                            </Link>			
                        </div>
                        <div className="swiper-btn-center-lr">
                            <TrandingSlider 
                                showdetailModal={()=>setDetailModal(true)}
                            />
                            <div className="pagination-align">
                                <div className="tranding-button-prev btn-prev">
                                    <i className="flaticon flaticon-left-chevron"/>
                                </div>
                                <div className="tranding-button-next btn-next">
                                    <i className="flaticon flaticon-chevron"/>
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