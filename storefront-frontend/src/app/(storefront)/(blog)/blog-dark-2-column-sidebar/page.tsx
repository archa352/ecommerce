import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import BlogSidebar from "@/elements/Blog/BlogSidebar";
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

const BlogDark2SidebarData : BlogDark2Type[] = [
    {dealy : "0.1s", image: IMAGES.BlogPost5Pic1, date:'25 May, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogPost5Pic2, date:'30 May, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
    {dealy : "0.3s", image: IMAGES.BlogPost5Pic3, date:'17 May, 2025', text:"Closet Confidential: Behind-the-Scenes of a Fashionista"},
    {dealy : "0.4s", image: IMAGES.BlogPost5Pic4, date:'10 May, 2025', text:"Fashion Forward: Spotlight on Emerging Designers"},
    {dealy : "0.5s", image: IMAGES.BlogPost5Pic5, date:'19 May, 2025', text:"Accessorize Me: The Power of Statement Pieces"},
    {dealy : "0.6s", image: IMAGES.BlogPost5Pic6, date:'26 May, 2025', text:"DIY Couture: Crafting Your Own Fashion Masterpieces"},
]; 

export default function BlogDark2Sidebar(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" currentText="Blog Dark 2 Column Sidebar" mainText="Blog Dark 2 Column Sidebar" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 col-lg-8">
                                <div className="row">
                                    {BlogDark2SidebarData.map((elem, i)=>(
                                        <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp" data-wow-delay={elem.dealy} key={i}>
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
                                                    <Link href="/post-standard" className="font-14 read-btn">Read More 
                                                        <i className="icon feather icon-chevron-right"/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.7s">
                                        <Link href="/blog-dark-2-column-sidebar" className="btn btn-secondary">
                                            Load More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 m-b30">
                                <aside className="side-bar sticky-top">
                                    <BlogSidebar />
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>
            </div> 
        </>
    )
}