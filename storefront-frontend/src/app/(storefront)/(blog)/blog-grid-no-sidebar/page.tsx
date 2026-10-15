import Link from "next/link"
import CommanBanner from "@/components/CommanBanner"
import IMAGES from "@/constant/theme"
import { BlogGridData } from "@/constant/Alldata"
import Image from "next/image"


export default function BlogGridNoSidebar(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" mainText="Blog Grid No Sidebar" currentText="Blog Grid No Sidebar" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    {BlogGridData.map((elem, ind)=>(
                                        <div className="col-lg-4 col-md-6 col-sm-6 m-b30 wow fadeInUp" data-wow-delay={elem.dealy} key={ind}>
                                            <div className="dz-card style-5">
                                                <div className="dz-media">
                                                    <Image src={elem.image} alt="/" />
                                                </div>
                                                <div className="dz-info">
                                                    <div className="dz-meta">
                                                        <ul>
                                                            <li className="post-date">{elem.date}</li>                                                    
                                                        </ul>
                                                    </div>
                                                    <h4 className="dz-title">
                                                        <Link className="text-white" href="/post-left-sidebar">{elem.text}</Link>
                                                    </h4>
                                                    <Link href="/post-left-sidebar" className="font-14 mt-auto read-btn">Read More 
                                                        <i className="icon feather icon-chevron-right"/>
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
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}