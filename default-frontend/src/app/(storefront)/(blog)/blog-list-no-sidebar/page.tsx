import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { Bloglight2 } from "@/constant/Alldata";
import Image from "next/image";


export default function BlogListNoSidebar(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" mainText="Blog List No Sidebar" currentText="Blog List No Sidebar" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="min-container">
                        <div className="row">
                            {Bloglight2.map((item, ind)=>(
                                <div className="col-lg-12 m-b30 wow fadeInUp" data-wow-delay="0.1s" key={ind}>
                                    <div className="dz-card blog-half style-5">
                                        <div className="dz-media">
                                            <Image src={item.image} alt="/" />
                                        </div>
                                        <div className="dz-info">
                                            <div className="dz-meta">
                                                <ul>
                                                    <li className="post-date">{item.date}</li>
                                                </ul>
                                            </div>
                                            <h4 className="dz-title">
                                                <Link href="/blog-grid-both-sidebar">{item.text}</Link>
                                            </h4>
                                            <Link href="/blog-grid-both-sidebar" className="font-14 read-btn">Read More 
                                                <i className="icon feather icon-chevron-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}                        
                            <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.7s">
                                <Link href="/blog-dark-half-image" className="btn btn-secondary">
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