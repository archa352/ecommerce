import Link from "next/link";
import IMAGES from "../../constant/theme";
import Image from "next/image";

export default function LatestPostSection(){
    return(
        <div className="container">
            <div className="section-head style-1 wow fadeInUp d-md-flex justify-content-between align-items-center" data-wow-delay="0.1s">
                <div className="left-content">
                    <h2 className="title">latest Post</h2>
                    <p>Discover the most trending products in Pixio.</p>
                </div>
                <Link className="btn btn-secondary " href="/blog-archive">View All</Link>
            </div>
            <div className="row blog-shap">
                <div className="col-lg-6 col-md-12 col-sm-12 m-b30 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="dz-card style-1 light">
                        <div className="dz-media">
                            <Image src={IMAGES.BlogPost3Pic1} alt="/" />
                        </div>
                        <div className="dz-info bg-white">
                            <div className="dz-meta">
                                <ul>
                                    <li className="post-date">17 May 2025</li>
                                </ul>
                            </div>
                            <h3 className="dz-title">
                                <Link href="/post-standard">Trendsetter Chronicles: Unveiling the Latest in Fashion</Link>
                            </h3>
                            <Link href="/post-standard" className="font-14 mt-auto read-btn">Read More 
                                <i className="icon feather icon-chevron-right"></i>
                            </Link>
                        </div>
                    </div>
                </div> 
                <div className="col-lg-6 col-md-12 col-sm-12 m-b30 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="row">
                        <div className="col-lg-12 col-md-6 m-b30">
                            <div className="dz-card blog-half style-7">
                                <div className="dz-media">
                                    <Image src={IMAGES.BlogPostPic2} alt="/" />
                                </div>
                                <div className="dz-info">
                                    <div className="dz-meta">
                                        <ul>
                                            <li className="post-date">17 May 2025</li>
                                        </ul>
                                    </div>
                                    <h4 className="dz-title">
                                        <Link href="/blog-grid-both-sidebar">Dress to Impress: Elevate Your Everyday Style</Link>
                                    </h4>
                                    <Link href="/post-standard" className="font-14 mt-auto read-btn">Read More 
                                        <i className="icon feather icon-chevron-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-6 m-b30">
                            <div className="dz-card blog-half style-7">
                                <div className="dz-media">
                                    <Image src={IMAGES.BlogPostPic3} alt="/" />
                                </div>
                                <div className="dz-info">
                                    <div className="dz-meta">
                                        <ul>
                                            <li className="post-date">17 May 2025</li>
                                        </ul>
                                    </div>
                                    <h4 className="dz-title">
                                        <Link href="/blog-grid-both-sidebar">Chic & Unique: Personalized Fashion Finds</Link>
                                    </h4>
                                    <Link href="/post-standard" className="font-14 mt-auto read-btn">Read More 
                                        <i className="icon feather icon-chevron-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>	
        </div>
    )
}