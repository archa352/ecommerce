"use client"
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { shopStyleData } from "@/constant/Alldata";
import ShopGridCard from "@/elements/Shop/ShopGridCard";
import BasicModalData from "@/components/BasicModalData";
import ModalSlider from "@/components/ModalSlider";
import { useState } from "react";
import { Modal } from "react-bootstrap";


export default function ShopStyle1(){
     const  [detailModal, setDetailModal] = useState<boolean>(false)
    return(
        <div className="page-content bg-light">
            <CommanBanner mainText="Shop Style 1" parentText="Home" currentText="Shop Style 1" image={IMAGES.BackBg1.src}/>
            <section className="content-inner-1 z-index-unset">
                <div className="container">
                    <div className="row m-auto gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3">
                        {shopStyleData.map((item, index)=>(
                            <div className="col-6 col-xl-4 col-lg-4 col-md-4 col-sm-6 m-md-b15 m-sm-b0 m-b30" key={index}>                                                                
                                <ShopGridCard image={item.image} title={item.name} price={item.price} showdetailModal={()=>setDetailModal(true)}/>                               
                            </div>
                        ))}                       
                    </div>
                    <div className="row page mt-0">
                        <div className="col-md-6">
                            <p className="page-text">Showing 1–5 of 50 Results</p>
                        </div>
                        <div className="col-md-6">
                            <nav aria-label="Blog Pagination">
                                <ul className="pagination style-1">
                                    <li className="page-item"><Link className="page-link active" href={"#"}>1</Link></li>
                                    <li className="page-item"><Link className="page-link" href={"#"}>2</Link></li>
                                    <li className="page-item"><Link className="page-link" href={"#"}>3</Link></li>
                                    <li className="page-item"><Link className="page-link next" href={"#"}>Next</Link></li>
                                </ul>
                            </nav>
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