"use client"
import Link from "next/link";
import { useState } from "react";
import { Modal, Tab } from "react-bootstrap";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import PaginationBlog from "@/elements/Shop/PaginationBlog";
import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxTwo from "@/elements/Shop/SelectBoxTwo";
import ShopSidebar from "@/elements/Shop/ShopSidebar";
import { shopStyleData, TabData } from "@/constant/Alldata";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import BasicModalData from "@/components/BasicModalData";
import ModalSlider from "@/components/ModalSlider";
import Image from "next/image";

export default function ShopSidebarBlog(){
    const  [detailModal, setDetailModal] = useState<boolean>(false)
    const [mobileSidebar, setMobileSidebar] = useState<boolean>(false)
    return(
        <div className="page-content bg-light">
            <CommanBanner mainText="Shop Sidebar" currentText="Shop Sidebar" parentText="Home" image={IMAGES.BackBg1.src}/>
            <section className="content-inner-3 pt-3">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-3">
                            <div className="sticky-xl-top">
                                <Link href={"#"} className={`panel-close-btn ${mobileSidebar ? "active" : ""}`}
                                    onClick={()=>setMobileSidebar(false)}
                                >																	
                                    <svg width="35" height="35" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M37.748 12.5L12.748 37.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12.748 12.5L37.748 37.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Link>
                                <div className={`shop-filter mt-xl-2 mt-0 ${mobileSidebar ? "active" : ""}`}>
                                    <aside>   
                                        <div className="d-flex align-items-center justify-content-between m-b30">
                                            <h6 className="title mb-0 fw-normal d-flex">
                                                <i className="flaticon-filter me-3"/>
                                                Filter
                                            </h6>
                                        </div>                                     
                                        <ShopSidebar />
                                        <Link href="#" className="btn btn-sm font-14 btn-secondary btn-sharp">RESET</Link>
                                    </aside>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-9">
                            <Tab.Container defaultActiveKey={'List'}>
                                <div className="filter-wrapper">
                                    <div className="filter-left-area">								
                                        <ul className="filter-tag">
                                            <li>
                                                <Link href={"#"} className="tag-btn">Dresses 
                                                    <i className="icon feather icon-x tag-close"/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={"#"} className="tag-btn">Tops 
                                                    <i className="icon feather icon-x tag-close"/>
                                                </Link>
                                            </li>
                                        </ul>
                                        <span>Showing 1–5 Of 50 Results</span>
                                    </div>
                                    <div className="filter-right-area">
                                        <Link href={"#"} className="panel-btn"  onClick={()=>setMobileSidebar(true)}>
                                            <svg className="me-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="20" height="20"><g id="Layer_28" data-name="Layer 28"><path d="M2.54,5H15v.5A1.5,1.5,0,0,0,16.5,7h2A1.5,1.5,0,0,0,20,5.5V5h2.33a.5.5,0,0,0,0-1H20V3.5A1.5,1.5,0,0,0,18.5,2h-2A1.5,1.5,0,0,0,15,3.5V4H2.54a.5.5,0,0,0,0,1ZM16,3.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path><path d="M22.4,20H18v-.5A1.5,1.5,0,0,0,16.5,18h-2A1.5,1.5,0,0,0,13,19.5V20H2.55a.5.5,0,0,0,0,1H13v.5A1.5,1.5,0,0,0,14.5,23h2A1.5,1.5,0,0,0,18,21.5V21h4.4a.5.5,0,0,0,0-1ZM17,21.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5v-2a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5Z"></path><path d="M8.5,15h2A1.5,1.5,0,0,0,12,13.5V13H22.45a.5.5,0,1,0,0-1H12v-.5A1.5,1.5,0,0,0,10.5,10h-2A1.5,1.5,0,0,0,7,11.5V12H2.6a.5.5,0,1,0,0,1H7v.5A1.5,1.5,0,0,0,8.5,15ZM8,11.5a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1-.5-.5Z"></path></g></svg>
                                            Filter
                                        </Link>
                                        <div className="form-group">
                                            <SelectBoxOne />
                                        </div>
                                        <div className="form-group Category">
                                            <SelectBoxTwo />
                                        </div>
                                        <div className="shop-tab">
                                            <TabData />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <Tab.Content className="col-12 tab-content shop-" id="pills-tabContent">
                                        <Tab.Pane eventKey={"List"}>
                                            <div className="row">
                                                {shopStyleData.slice(2,8).map((elem, ind)=>(
                                                    <div className="col-md-12 col-sm-12" key={ind}>                                                        
                                                        <div className="dz-shop-card style-2">
                                                            <div className="dz-media">
                                                                <Image src={elem.image} alt="shop" />
                                                            </div>
                                                            <div className="dz-content">
                                                                <div className="dz-header">
                                                                    <div>
                                                                        <h4 className="title mb-0"><Link href="/shop-with-category">Stylish Fedora Hat Collection</Link></h4>
                                                                        <ul className="dz-tags">
                                                                            <li><Link href="/shop-with-category">Accessories,</Link></li>
                                                                            <li><Link href="/shop-with-category">Sunglasses</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="review-num">
                                                                        <ul className="dz-rating">
                                                                            <li className="star-fill">
                                                                                <i className="flaticon-star-1"/>
                                                                            </li>										
                                                                            <li className="star-fill">
                                                                                <i className="flaticon-star-1"/>
                                                                            </li>
                                                                            <li className="star-fill">
                                                                                <i className="flaticon-star-1"/>
                                                                            </li>
                                                                            <li>
                                                                                <i className="flaticon-star-1"/>
                                                                            </li>
                                                                            <li>
                                                                                <i className="flaticon-star-1"/>
                                                                            </li>
                                                                        </ul>
                                                                        <span><Link href="#"> 370 Review</Link></span>
                                                                    </div>
                                                                </div>
                                                                <div className="dz-body">
                                                                    <div className="dz-rating-box">
                                                                        <div>
                                                                            <p className="dz-para">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="rate">
                                                                        <div className="d-flex align-items-center mb-xl-3 mb-2">
                                                                            <div className="meta-content">
                                                                                <span className="price-name">Price</span>
                                                                                <span className="price">$40.00</span>
                                                                            </div>
                                                                            <div className="meta-content">
                                                                                <span className="color-name">Color</span>
                                                                                <div className="d-flex align-items-center color-filter">
                                                                                    <div className="form-check">
                                                                                        <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel11" value="#24262B" aria-label="..." defaultChecked />
                                                                                        <span style={{backgroundColor : "#24262B" }}></span>
                                                                                    </div>
                                                                                    <div className="form-check">
                                                                                        <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel12" value="#8CB2D1" aria-label="..." />
                                                                                        <span style={{backgroundColor : "#8CB2D1" }}></span>
                                                                                    </div>
                                                                                    <div className="form-check">
                                                                                        <input className="form-check-input" type="radio" name="radioNoLabel" id="radioNoLabel13" value="#0D775E" aria-label="..." />
                                                                                        <span style={{backgroundColor : "#0D775E" }}></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex">
                                                                            <Link href="/shop-cart" className="btn btn-secondary btn-md btn-icon">
                                                                                <i className="icon feather icon-shopping-cart d-md-none d-block" />
                                                                                <span className="d-md-block d-none">Add to cart</span>
                                                                            </Link>
                                                                            <div className="bookmark-btn style-1">
                                                                                <input className="form-check-input" type="checkbox" id={elem.inputtype} />
                                                                                <label className="form-check-label" htmlFor={elem.inputtype}>
                                                                                    <i className="fa-solid fa-heart"></i>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>                                            
                                        </Tab.Pane>
                                         <Tab.Pane  eventKey={"Coloumn"}>
                                            <div className="row gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3">
                                                {shopStyleData.slice(0,8).map((item, ind)=>(                                                    
                                                    <div className="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 m-md-b15 m-sm-b0 m-b30" key={ind}>
                                                        <ShopGridCard image={item.image} title={item.name} price={item.price} showdetailModal={()=>setDetailModal(true)}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </Tab.Pane>                                                                                
                                         <Tab.Pane  eventKey={"Grid"}>
                                            <div className="row gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3">
                                                {shopStyleData.map((item, ind)=>(
                                                    <div className="col-6 col-xl-4 col-lg-4 col-md-4 col-sm-4 m-md-b15 m-sm-b0 m-b30" key={ind}>
                                                        <ShopGridCard image={item.image} title={item.name} price={item.price} showdetailModal={()=>setDetailModal(true)}/>
                                                    </div>
                                                ))}
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                            <div className="row page mt-0">
                                <div className="col-md-6">
                                    <p className="page-text">Showing 1–5 of 50 Results</p>
                                </div>
                                <div className="col-md-6">
                                    <nav aria-label="Blog Pagination">
                                        <ul className="pagination style-1 p-t20">
                                            <PaginationBlog />
                                        </ul>
                                    </nav>
                                </div>
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