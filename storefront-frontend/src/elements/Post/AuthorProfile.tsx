import Image from "next/image";
import IMAGES from "../../constant/theme";
import SocialIcon from "../SocialIcon";

export default function AuthorProfile(){
    return(
        <div className="author-profile-info">
            <div className="author-profile-pic">
                <Image src={IMAGES.BlogProfile} alt="/" />
            </div>
            <div className="author-profile-content">
                <h6 className="title">I am John Doe</h6>
                <p>We were making our way to the Rila Mountains, where we were visiting the Rila Monastery where we enjoyed scrambled eggs.</p>
                <ul className="social-icon m-b0">
                    <SocialIcon />
                </ul>
            </div>
        </div>
    )
}