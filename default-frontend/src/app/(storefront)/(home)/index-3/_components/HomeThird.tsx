"use client"
import { Fragment, useState } from "react"
import Link from "next/link";
import { Modal } from "react-bootstrap";
import LatestoCollection from "@/elements/Home3/LatestCollection";
import MainBanner3 from "@/elements/Home3/MainBanner3";
import ProductSection from "@/elements/Home/ProductSection";
import SummerSaleBlog from "@/elements/Home/SummerSaleBlog";
import AllProduction from "@/elements/Home/AllProduction";
import OffersectionSlider from "@/elements/Home/OffersectionSlider";
import SponsoredSlider from "@/elements/Home/SponsoredSlider";
import LatestPostSection from "@/elements/Home3/LatestPostSection";

const HomeThird = () => {
    const [openVideo, setOpenVideo] = useState<boolean>(false);
    return (
        <Fragment>
            <MainBanner3 OpenVideo={() => setOpenVideo(true)} />
            <section className="content-inner overflow-hidden bg-light-dark">
                <div className="container">
                    <LatestoCollection />
                </div>
            </section>
            <section className="content-inner">
                <div className="container">
                    <ProductSection />
                </div>
            </section>
            <section className=" adv-area">
                <div className="container-fluid px-0">
                    <SummerSaleBlog />
                </div>
            </section>
            <section className="content-inner-2 overflow-hidden">
                <div className="container">
                    <AllProduction />
                </div>
            </section>
            <section className="content-inner-2">
                <div className="container">
                    <div
                        className="section-head style-1 wow fadeInUp d-flex justify-content-between m-b30"
                        data-wow-delay="0.2s"
                    >
                        <div className="left-content">
                            <h2 className="title">Featured offer for you</h2>
                        </div>
                        <Link
                            href="/shop-list"
                            className="text-secondary font-14 d-flex align-items-center gap-1"
                        >
                            See All
                            <i className="icon feather icon-chevron-right font-18" />
                        </Link>
                    </div>
                </div>
                <div className="container-fluid px-3">
                    <OffersectionSlider />
                </div>
            </section>
            <section className="content-inner-2">
                <div className="container">
                    <div
                        className="section-head style-1 wow fadeInUp d-flex  justify-content-between"
                        data-wow-delay="0.2s"
                    >
                        <div className="left-content">
                            <h2 className="title">Sponsored</h2>
                        </div>
                        <Link
                            href="/shop-list"
                            className="text-secondary font-14 d-flex align-items-center gap-1"
                        >
                            See All
                            <i className="icon feather icon-chevron-right font-18" />
                        </Link>
                    </div>
                    <SponsoredSlider />
                </div>
            </section>
            <section className="content-inner ">
                <LatestPostSection />
            </section>
            <Modal className="quick-view-modal" show={openVideo} onHide={()=>setOpenVideo(false)} centered>               
                <button type="button" className="btn-close" onClick={()=>setOpenVideo(false)}>
                    <i className="icon feather icon-x"/>
                </button>
                <div className="modal-body">
                    <video width="100%" height="100%" controls autoPlay>
                        <source src="/assets/images/video.mp4" type="video/mp4"/>
                    </video>                           
                </div>  
            </Modal>
        </Fragment>
    )
}
export default HomeThird;