import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface dataType {
    image :  string | StaticImageData
    name :  string
    post :  string
}

const TeamImageCard = ({image,name,post} : dataType) => {
    return (
        <div className="dz-team style-1 m-md-b0 m-sm-b0 m-b30 wow fadeInUp" data-wow-delay="0.2s">
            <div className="dz-media">
                <Link href="#"><Image src={image} alt={post} /></Link>
                <ul className="team-social-icon">
                    <li><Link href="https://www.facebook.com/dexignzone" target="_blank"><i className="fab fa-facebook-f" /></Link></li>
                    <li><Link href="https://twitter.com/dexignzone" target="_blank"><i className="fab fa-twitter" /></Link></li>
                    <li><Link href="https://www.instagram.com/dexignzone/" target="_blank"><i className="fab fa-instagram" /></Link></li>
                    <li><Link href="https://www.linkedin.com/in/dexignzone/" target="_blank"><i className="fa-brands fa-linkedin-in" /></Link></li>
                </ul>
            </div>
            <div className="dz-content">
                <h5 className="title"><Link href="/our-team">{name}</Link></h5>
                <span>{post}</span>
            </div>
        </div>
    );
};

export default TeamImageCard;