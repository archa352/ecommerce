import Link from "next/link";
import IMAGES from "../../constant/theme";
import { FeatureBoxBlog } from "../../constant/Alldata";
import Image from "next/image";

export default function FeatureBoxSection(){
    return(
        <div className="row gx-0">
            {FeatureBoxBlog.map((elem, index)=>(
                <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-4 wow fadeIn" data-wow-delay="0.1s" key={index}>
                    <div className="insta-post dz-media dz-img-effect rotate">
                        <Link href="/portfolio-tiles">
                            <Image src={elem.image} alt="feature" />
                        </Link>
                    </div>
                </div>
            ))}            
            <Link href="https://www.instagram.com/dexignzone/" className="instagram-link">
                <div className="follow-link  wow bounceIn" data-wow-delay="0.1s">
                    <div className="follow-link-icon">
                        <Image src={IMAGES.InstaFollow} alt="follow" />
                    </div>
                    <div className="follow-link-content">
                        <p className="m-0">Follow @Pixio</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}