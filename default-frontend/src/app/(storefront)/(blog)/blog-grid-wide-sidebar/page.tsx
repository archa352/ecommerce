import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import { BlogGridData } from "@/constant/Alldata";
import IMAGES from "@/constant/theme";
import Image from "next/image";


const GridwideData = [
    {dealy : "0.1s", image: IMAGES.BlogPost5Pic5, date:'15 Jan, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogPost5Pic6, date:'16 Jan, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
];
const updatedUsers = GridwideData.concat(BlogGridData);

export default function BlogGridWideSidebar(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" currentText="Blog Grid Wide" mainText="Blog Grid Wide" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    {updatedUsers.map((data, ind)=>(
                                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 m-b30 wow fadeInUp" data-wow-delay="0.1s" key={ind}>
                                            <div className="dz-card style-5">
                                                <div className="dz-media">
                                                    <Image src={data.image} alt="/" />
                                                </div>
                                                <div className="dz-info">
                                                    <div className="dz-meta">
                                                        <ul>
                                                            <li className="post-date">{data.date}</li>
                                                        </ul>
                                                    </div>
                                                    <h4 className="dz-title">
                                                        <Link className="text-white" href="/blog-dark-2-column">{data.text}</Link>
                                                    </h4>
                                                    <Link href="/blog-dark-2-column" className="font-14 read-btn">Read More 
                                                        <i className="icon feather icon-chevron-right"/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-12 text-center mt-sm-4 mb-sm-4  wow fadeInUp" data-wow-delay="1.0s">
                                        <Link href="/blog-grid-wide-sidebar" className="btn btn-secondary text-center">Load More</Link>
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