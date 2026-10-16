"use client"
import Link from "next/link";
import TrandingSlider from "@/elements/Home2/TrandingSlider";
import { useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import ProductTabStyleOne from "@/elements/Shop/ProductTabStyleOne";
import IMAGES from "@/constant/theme";
import Comments from "@/elements/Post/Comments";
import ThumbnailRightProductDetail from "@/elements/Shop/ThumbnailRightProductDetail";

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Image, { StaticImageData } from "next/image";

interface  gridMedaitype{
    image : any;
}
const GridMedaiCard = ( props: gridMedaitype)=>{
    return(
        <div className="dz-media "> 
            <Link className="mfp-link lg-item DZoomImage" href={props.image.src} data-src={props.image.src}>
                <i className="feather icon-maximize dz-maximize top-left" />
                <Image src={props.image} alt="" className=" d-none"/> 
            </Link>
            <Image src={props.image} alt="Description" /> 
        </div>
    )
}

export default function ShopProductGridMedia(){
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
        <>
            <div className="page-content bg-light">
                <div className="d-sm-flex justify-content-between container-fluid py-3">
                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                        <ul className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                            <li className="breadcrumb-item">Product Grid Media</li>
                        </ul>
                    </nav>
                </div>                
                <section className="content-inner py-0">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-6 col-md-6">
                                <div className="dz-product-detail static-media sticky-top">
                                    <LightGallery 
                                        plugins={[lgThumbnail, lgZoom]}
                                        selector={'.DZoomImage'}
                                    >
                                        <div className="row align-items-center gx-xl-4 gx-3">
                                            <div className="col-xl-6 col-md-6 col-6">
                                                <GridMedaiCard image={IMAGES.Productdetail3png1}/>
                                                <GridMedaiCard image={IMAGES.Productdetail3png2}/>
                                            </div>
                                            <div className="col-xl-6 col-md-6 col-6">
                                                <GridMedaiCard image={IMAGES.Productdetail3png3}/>
                                                <GridMedaiCard image={IMAGES.Productdetail3png4}/>                                            
                                            </div>	
                                        </div>
                                    </LightGallery>
                                </div>	
                            </div>
                            <div className="col-xl-6 col-md-6">
                                <div className="dz-product-detail style-2 p-t50 mb-0">
                                    <div className="dz-content">
                                        <ThumbnailRightProductDetail 
                                            title="Yellow Floral One Shoulder Chiffon Dress" 
                                            para="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                                        />                                       
                                    </div>                                    
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
                                            <ProductTabStyleOne image1 = {IMAGES.ProductFeature2Png1} image2={IMAGES.ProductFeature2Png2} image3={IMAGES.ProductFeature2Png3}  />
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