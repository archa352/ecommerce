import Link from "next/link";
import IMAGES from "@/constant/theme";
import SwegarBlog from "@/elements/Portfolio/SwegarBlog";
import RelatedSlider from "@/elements/Portfolio/RelatedSlider";
import DetailListBlog from "@/elements/Portfolio/DetailListBlog";
import Image from "next/image";


interface CardImgtype{
    image : any
}

function GalleryCard(props : CardImgtype){
    return(        
        <div className="dz-box portfolio-bx style-1">
            <div className="dz-media rounded">
                <Link className="mfp-link lg-item" href={props.image} data-src={props.image}>
                    <i className="feather icon-maximize dz-maximize top-right"/>
                </Link>
                <Image src={props.image} alt="portfolio" />
            </div>
        </div>            
    )
}

export default function PortfolioDetails2(){
    return(
        <div className="page-content bg-light">
            <div className="dz-bnr-inr dz-bnr-inr-lg overlay-black-middle text-center overflow-hidden" 
                style={{backgroundImage:`url('${IMAGES.PortfolioBannerBg.src}')`}}>
                <div className="container">
                    <div className="post-header dz-bnr-inr-entry blog-single style-1">
                        <Link href="/portfolio-details-1" className="mb-4">
                            <span className="badge badge-primary mb-3">fashion</span>
                        </Link>
                        <h1 className="dz-title text-white mx-auto">Make your fashion look mire charming</h1>
                        <div className="detail-list-box style-2">
                            <DetailListBlog />
                        </div>
                    </div>
                </div>
            </div>
            <section className="content-inner portfolio-detail-2" id="lightgallery">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="row">
                                <div className="col-xl-4 col-lg-4 m-b30">
                                    <GalleryCard image={IMAGES.Portfolio2Pic1} />
                                </div>
                                <div className="col-xl-8 col-lg-8 m-b30">
                                    <div className="dz-detail-box style-2">
                                        <h2>Research & Planning</h2>
                                        <p className="m-b30 m-sm-b20">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
                                        
                                        <p className="mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. </p>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6 col-6 m-b30">
                                    <GalleryCard image={IMAGES.Portfolio2Pic2} />
                                </div>
                                <div className="col-xl-4 col-md-4 col-sm-6 col-6 m-b30">
                                    <GalleryCard image={IMAGES.Portfolio2Pic3} />
                                </div>
                                <div className="col-xl-4 col-md-4 m-b30">
                                    <GalleryCard image={IMAGES.Portfolio2Pic4} />
                                </div>
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