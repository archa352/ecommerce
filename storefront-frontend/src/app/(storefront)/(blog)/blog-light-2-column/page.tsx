import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Image from "next/image";

interface BlogDark2Type{
    dealy : string;
    image: string;
    date: string;
    text : string;
}

const BlogLight2 : BlogDark2Type[] = [
    {dealy : "0.1s", image: IMAGES.BlogPost3Pic1, date:'25 Jan, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogPost3Pic2, date:'30 Jan, 2025', text:"Chic & Unique: Personalized Fashion Finds"},
    {dealy : "0.3s", image: IMAGES.BlogPost3Pic3, date:'17 Jan, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
    {dealy : "0.4s", image: IMAGES.BlogPost3Pic4, date:'21 Jan, 2025', text:"Closet Confidential: Behind-the-Scenes of a Fashionista"}
]; 

export default function BlogLight2Column(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner currentText="Blog Light 2 Column" mainText="Blog Light 2 Column" parentText="Home" image={IMAGES.BackBg1.src}/>
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            {BlogLight2.map((item, ind)=>(
                                <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={item.dealy} key={ind}>
                                    <div className="dz-card style-1 light">
                                        <div className="dz-media">
                                            <Image src={item.image} alt="/" />
                                        </div>
                                        <div className="dz-info">
                                            <div className="dz-meta">
                                                <ul>
                                                    <li className="post-date">{item.date}</li>
                                                </ul>
                                            </div>
                                            <h3 className="dz-title">
                                                <Link href="/post-standard">{item.text}</Link>
                                            </h3>
                                            <Link href="/post-standard" className="font-14 mt-auto read-btn">Read More 
                                                <i className="icon feather icon-chevron-right" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.5s">
                                <Link href="/blog-light-2-column" className="btn btn-secondary">
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