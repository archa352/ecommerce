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
    {dealy : "0.1s", image: IMAGES.BlogGrid1, date:'25 May, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogGrid2, date:'30 May, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
    {dealy : "0.3s", image: IMAGES.BlogGrid3, date:'17 May, 2025', text:"Closet Confidential: Behind-the-Scenes of a Fashionista"},
    {dealy : "0.4s", image: IMAGES.BlogGrid4, date:'21 May, 2025', text:"DIY Couture: Crafting Your Own Fashion Masterpieces"},
    {dealy : "0.5s", image: IMAGES.BlogGrid5, date:'25 May, 2025', text:"Street Style Safari: Global Fashion Influences"},
    {dealy : "0.6s", image: IMAGES.BlogGrid1, date:'28 May, 2025', text:"Sustainable Style: Eco-Friendly Fashion Choices"},
]; 

export default function BlogDark3Coloumn(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" currentText="Blog Dark 3 Column" mainText="Blog Dark 3 Column" image={IMAGES.BackBg1.src}/>
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            {BlogDark2.map((elem, ind)=>(
                                <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={elem.dealy} key={ind}>
                                    <div className="dz-card style-2 dark">
                                        <div className="dz-media">
                                            <Image src={elem.image} alt="gird" />
                                            <div className="post-date">{elem.date}</div>
                                        </div>
                                        <div className="dz-info">
                                            <h4 className="dz-title mb-0">
                                                <Link href="/post-standard">{elem.text}</Link>
                                            </h4>
                                            <ul className="blog-social">
                                                <li>
                                                    <Link className="share-btn" href={"#"}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M7 17L17 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M7 7H17V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </Link>								
                                                    <ul className="sub-team-social">
                                                        <li><Link href="https://www.facebook.com/" target="_blank"><i className="fab fa-facebook-f"/></Link></li>
                                                        <li><Link href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank"><i className="fa-brands fa-linkedin"/></Link></li>
                                                        <li><Link href="https://www.instagram.com/" target="_blank"><i className="fab fa-instagram"/></Link></li>
                                                        <li><Link href="https://www.behance.net/dexignzone" target="_blank"><i className="fa-brands fa-behance"/></Link></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}                        
                            <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.5s">
                                <Link href="/blog-dark-2-column" className="btn btn-secondary">
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