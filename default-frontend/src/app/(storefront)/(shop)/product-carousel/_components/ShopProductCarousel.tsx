"use client"
import Link from "next/link"
import { useState } from "react";
import ProductInputButton from "@/elements/Shop/ProductInputButton";
import StarRating from "@/elements/Shop/StarRating";
import ShopProductSlider from "@/elements/Shop/ShopProductSlider";
import { Modal, Nav, Tab } from "react-bootstrap";
import ProductTabStyleOne from "@/elements/Shop/ProductTabStyleOne";
import Comments from "@/elements/Post/Comments";
import IMAGES from "@/constant/theme";
import TrandingSlider from "@/elements/Home2/TrandingSlider";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";

export default function ShopProductCarousel(){
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
        <div className="page-content bg-light">
            <div className="d-sm-flex justify-content-between container-fluid py-3">
                <nav aria-label="breadcrumb" className="breadcrumb-row">
                    <ul className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                        <li className="breadcrumb-item">Product Carousel</li>
                    </ul>
                </nav>
                <div className="pagination-align style-2">
                    <div className="portfolio-button-prev swiper-button-prev">Prev </div>
                    <div className="portfolio-button-next swiper-button-next">Next</div>
                </div>
            </div>
            <div className="content-inner py-0 overflow-hidden">
                <div className="swiper-pagination-two"></div>
                <div className="container-fluid">
                    <ShopProductSlider />
                    <div className="banner-social-media">
                        <ul>
                            <li>
                                <Link className="text-dark" href="https://www.instagram.com/dexignzone/">Instagram</Link>
                            </li>
                            <li>
                                <Link className="text-dark" href="https://www.facebook.com/dexignzone">Facebook</Link>
                            </li>
                            <li>
                                <Link className="text-dark" href="https://twitter.com/dexignzones">twitter</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <section className="content-inner-3 pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="dz-product-detail style-2 mw-100 ps-0">
                                <div className="dz-content">
                                    <div className="dz-content-footer">
                                        <div className="dz-content-start">
                                            <span className="badge bg-secondary mb-2">SALE 20% Off</span>
                                            <h4 className="title mb-1">Lady Red Coat Black Jeans</h4>
                                            <div className="review-num">
                                                <ul className="dz-rating me-2">
                                                    <StarRating />
                                                </ul>
                                                <span className="text-secondary me-2">4.7 Rating</span>
                                                <Link href="#">(5 customer reviews)</Link>
                                            </div>
                                        </div>
                                        <ul className="d-lg-flex align-items-center d-none">
                                            <li className="icon-bx-wraper style-3 me-xl-4 me-2">
                                                <div className="icon-bx">
                                                    <i className="flaticon flaticon-ship" />
                                                </div>
                                                <div className="info-content">
                                                    <span>FREE</span>
                                                    <h6 className="dz-title mb-0">Shipping</h6>
                                                </div>
                                            </li>
                                            <li className="icon-bx-wraper style-3">
                                                <div className="icon-bx">
                                                    <i className="flaticon-fast-delivery-1" />
                                                </div>
                                                <div className="info-content">
                                                    <span>Easy Returns</span>
                                                    <h6 className="dz-title mb-0">30 Days</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="para-text">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    </p>
                                    <div className="meta-content m-b20 d-flex align-items-end justify-content-between justify-content-sm-start">
                                        <div className="me-5">
                                            <span className="form-label mb-0 mb-md-2">Price</span>
                                            <span className="price">$125.75 <del>$132.17</del></span>
                                        </div>
                                        <div className="btn-quantity light d-md-block d-none me-0">
                                            <label className="form-label">Quantity</label>
                                            <ProductInputButton />
                                        </div>
                                        <div className="btn-quantity light quantity-sm d-md-none d-block me-0">
                                            <label className="form-label">Quantity</label>
                                            <ProductInputButton />
                                        </div>
                                    </div>
                                    <div className="btn-group cart-btn">
                                        <Link href="/shop-cart" className="btn btn-secondary text-uppercase me-md-4">Add To Cart</Link>
                                        <Link href="/shop-wishlist" className="btn btn-outline-secondary btn-icon">
                                            <i className="icon feather icon-heart"/>
                                            Add To Wishlist
                                        </Link>
                                    </div>
                                    <div className="dz-info style-2">
                                        <ul>
                                            <li><strong>SKU:</strong></li>
                                            <li>PRT584E63A</li>
                                        </ul>
                                        <ul>
                                            <li><strong>Category:</strong></li>
                                            <li><Link href="/shop-standard">Dresses,</Link></li>
                                            <li><Link href="/shop-standard">Jeans,</Link></li>
                                            <li><Link href="/shop-standard">Swimwear,</Link></li>
                                            <li><Link href="/shop-standard">Summer,</Link></li>
                                            <li><Link href="/shop-standard">Clothing,</Link></li>
                                        </ul>
                                        <ul>
                                            <li><strong>Tags:</strong></li>
                                            <li><Link href="/shop-standard">Casual,</Link></li>
                                            <li><Link href="/shop-standard">Athletic,</Link></li>
                                            <li><Link href="/shop-standard">Workwear,</Link></li>
                                            <li><Link href="/shop-standard">Accessories,</Link></li>
                                        </ul>
                                        <ul className="social-icon">
                                            <li><strong>Share:</strong></li>
                                            <li>
                                                <Link href="https://www.facebook.com/dexignzone" target="_blank">
                                                    <i className="fa-brands fa-facebook-f"/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank">
                                                    <i className="fa-brands fa-linkedin-in"/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="https://www.instagram.com/dexignzone/" target="_blank">
                                                    <i className="fa-brands fa-instagram"/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="https://www.behance.net/dexignzone" target="_blank">
                                                    <i className="fa-brands fa-behance"/>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
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
                                        <ProductTabStyleOne image1 = {IMAGES.ProductFeature3Png1} image2={IMAGES.ProductFeature3Png2} image3={IMAGES.ProductFeature3Png3}  />
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
        </div>
    )
}