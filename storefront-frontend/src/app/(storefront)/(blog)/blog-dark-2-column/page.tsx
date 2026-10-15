import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CardBlog from "@/elements/Blog/CardBlog";


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
    {dealy : "0.1s", image: IMAGES.BlogPost3Pic1, date:'25 May, 2025', text:"Trendsetter Chronicles: Unveiling the Latest in Fashion"},
    {dealy : "0.2s", image: IMAGES.BlogPost3Pic2, date:'30 May, 2025', text:"Closet Confidential: Behind-the-Scenes of a Fashionista"},
    {dealy : "0.3s", image: IMAGES.BlogPost3Pic3, date:'17 May, 2025', text:"Chic & Unique: Personalized Fashion Finds"},
    {dealy : "0.4s", image: IMAGES.BlogPost3Pic4, date:'10 May, 2025', text:"Runway Rundown: Decoding Fashion Week’s Best Looks"},
]; 

export default function BlogDark2Coloumn(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner parentText="Home" currentText="Blog Dark 2 Column" mainText="Blog Dark 2 Column" image={IMAGES.BackBg1.src}/>
                <section className="content-inner-1 z-index-unset">
                    <div className="container">
                        <div className="row">
                            {BlogDark2.map((elem, ind)=>(
                                <div className="col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={elem.dealy} key={ind}>
                                    <div className="dz-card style-1">
                                        <CardBlog image={elem.image} text={elem.text} date={elem.date} />
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