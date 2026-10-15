import Link from "next/link";
import DetailListBlog from "@/elements/Portfolio/DetailListBlog";
import IMAGES from "@/constant/theme";
import Portfolio4Slider from "@/elements/Portfolio/Portfolio4Slider";
import Image from "next/image";

interface CardImgtype{
    image : any
}

function GalleryCard(props : CardImgtype){
    return(  
        <div className="col-xl-6 col-sm-6 col-6 m-b30">
            <div className="dz-box portfolio-bx style-1">
                <div className="dz-media rounded">
                    <Link className="mfp-link lg-item" href={props.image} data-src={props.image}>
                        <i className="feather icon-maximize dz-maximize top-right"/>
                    </Link>
                    <Image src={props.image} alt="portfolio" />
                </div>
            </div>            
        </div>
    )
}

const portfoliobox : CardImgtype[] = [
    { image :  IMAGES.Portfolio2Pic1},
    { image :  IMAGES.Portfolio2Pic2},
    { image :  IMAGES.Portfolio2Pic3},
    { image :  IMAGES.Portfolio2Pic4},
];

export default function PortfolioDetails4(){
    return(
        <>
            <div className="page-content bg-light">
                <div className="container-fluid px-0 portfolio-detail-4">
                    <div className="portfolio-detail-inner column">
                        <div className="detail-inner-area left">
                            <div className="dz-bnr-inr dz-bnr-inr-lg overlay-black-middle text-center overflow-hidden" 
                                style={{backgroundImage:`url('${IMAGES.Portfolio4BannerBg.src}')`}}
                            >
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
                        </div>
                        <div className="detail-inner-area right" id="lightgallery">
                            <div className="row">
                                <div className="col-12">
                                    <div className="dz-detail-box border-0 p-0 text-justify">
                                        <h2>Research & Planning</h2>
                                        <p className="m-b30 m-lg-b20">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
                                        
                                        <p className="m-b35 m-lg-b20">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. </p>
                                    </div>
                                </div>                            
                                {portfoliobox.map((elem, index)=>(
                                    <GalleryCard  image={elem.image}  key={index}/>
                                ))}                            
                                <div className="col-xl-12 m-t50 m-sm-t0">
                                    <div className="post-pagination style-1">
                                        <div className="post-prev">
                                            <Link href="/portfolio-details-5" className="post-inner">
                                                <div className="inner-icon">
                                                    <i className="icon feather icon-chevron-left" />
                                                </div>
                                                <div className="dz-media me-3">
                                                    <Image src={IMAGES.PaginationPost1} alt="post" />
                                                </div>
                                                <div className="dz-info m-0">
                                                    <span>Swagger</span>
                                                    <h6 className="m-b0">Sophisticated Swagger Suit</h6>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="post-next">
                                            <Link href="/portfolio-details-5" className="post-inner">
                                                <div className="dz-info">
                                                    <span>Sweater</span>
                                                    <h6 className="m-b0">Cozy Knit Cardigan Sweater</h6>
                                                </div>
                                                <div className="dz-media">
                                                    <Image src={IMAGES.PaginationPost2} alt="post" />
                                                </div>
                                                <div className="inner-icon">
                                                    <i className="icon feather icon-chevron-right"></i>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="m-b80 m-t80 m-sm-b20 m-sm-t20 overflow-hidden releted-portfolio">
                                        <div className="section-head style-2">
                                            <div className="left-content">
                                                <h2 className="title mb-0">Related Projects</h2>
                                            </div>			
                                        </div>
                                        <div className="swiper-btn-center-lr">
                                            <Portfolio4Slider />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}