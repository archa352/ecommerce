import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Image from "next/image";

export default function BlogExclusive(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner mainText="Blog Exclusive" currentText="Blog Exclusive" parentText="Home" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row justify-content-lg-between justify-content-md-center">
                            <div className="col-lg-5 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div className="dz-card style-3">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic1} alt="/" />
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">17 May 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Trendsetter Chronicles: Unveiling the Latest in Fashion</Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.2s">
                                <div className="dz-card style-4">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic2} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">20 May 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Chic & Unique: Personalized Fashion Finds</Link>
                                        </h2>
                                        <Link href="/post-open-gutenberg" className="font-14 mt-auto read-btn">Read More 
                                            <i className="icon feather icon-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                                <div className="dz-card style-4">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic3} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">15 April 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Runway Rundown: Decoding Fashion Week’s Best Looks</Link>
                                        </h2>
                                        
                                        <Link href="/post-open-gutenberg" className="font-14 mt-auto read-btn">Read More 
                                            <i className="icon feather icon-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.4s">
                                <div className="dz-card style-3 ">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic4} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">25 May 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Sustainable Style: Eco-Friendly Fashion Choices</Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                                <div className="dz-card style-3 ">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic5} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">28 May 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Fashion Fails and Fixes: Learn from Style Mistakes</Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.6s">
                                <div className="dz-card style-4">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic6} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">26 June 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Body Positivity in Fashion: Embrace Your Unique Style</Link>
                                        </h2>
                                        
                                        <Link href="/post-open-gutenberg" className="font-14 mt-auto read-btn">Read More 
                                            <i className="icon feather icon-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                                <div className="dz-card style-4">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic7} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">7 March 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Fashion & Beauty Fusion: The Ultimate Style Guide</Link>
                                        </h2>
                                        
                                        <Link href="/post-open-gutenberg" className="font-14 mt-auto read-btn">Read More 
                                            <i className="icon feather icon-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.8s">
                                <div className="dz-card style-3 ">
                                    <div className="dz-media">
                                        <Image src={IMAGES.BlogPost1Pic8} alt="/"/>
                                    </div>
                                    <div className="dz-info">
                                        <div className="dz-meta">
                                            <ul>
                                                <li className="post-date">12 Mar 2025</li>
                                            </ul>
                                        </div>
                                        <h2 className="dz-title">
                                            <Link href="/post-open-gutenberg">Closet Confidential: Behind-the-Scenes of a Fashionista</Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 text-center mt-3 wow fadeInUp" data-wow-delay="0.9s">
                                <Link href="/blog-light-half-image" className="btn btn-secondary">
                                    Load More
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}