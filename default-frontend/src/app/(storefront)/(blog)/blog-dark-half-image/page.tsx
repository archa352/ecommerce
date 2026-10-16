import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};


interface BlogDark2Type{
    dealy : string;
    image: string;
    date: string;
    text : string;
}

const BlogDark2 : BlogDark2Type[] = [
    {dealy : "0.1s", image: IMAGES.BlogPostPic1, date:'25 Jan, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogPostPic2, date:'30 Jan, 2025', text:"Chic & Unique: Personalized Fashion Finds"},
    {dealy : "0.3s", image: IMAGES.BlogPostPic3, date:'17 Jan, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
    {dealy : "0.4s", image: IMAGES.BlogPostPic4, date:'21 Jan, 2025', text:"Closet Confidential: Behind-the-Scenes of a Fashionista"},
    {dealy : "0.5s", image: IMAGES.BlogPostPic5, date:'25 Jan, 2025', text:"Dress to Impress: Elevate Your Everyday Style"},
    {dealy : "0.6s", image: IMAGES.BlogPostPic6, date:'28 Jan, 2025', text:"Fashion Forward: Spotlight on Emerging Designers"},
]; 

export default function BlogDarkHalfImage(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" currentText="Blog Dark Half Image" mainText="Blog Dark Half Image" image={IMAGES.BackBg1.src}/>
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            {BlogDark2.map((item, ind)=>(
                                <div className="col-lg-6 col-md-6 col-sm-6 m-b30 wow fadeInUp" data-wow-delay={item.dealy} key={ind}>
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
                                                <i className="icon feather icon-chevron-right" />
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