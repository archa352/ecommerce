import Link from "next/link";
import IMAGES from "../../constant/theme";
import { Fragment } from "react/jsx-runtime";
import Image from "next/image";

interface postimage{
    image : boolean;
}

export default function PostTitleWithImage(props: postimage){
    return(
        <Fragment>
            <h1 className="dz-title">The Sustainable Wardrobe A Greener Approach to Fashion</h1>
            <div className="dz-meta">
                <ul>
                    <li className="post-date">22 May 2025</li>
                    <li className="dz-user">
                        <i className="fa-solid fa-user" />
                        By <Link href="#">KK Sharma</Link>
                    </li>
                    <li className="dz-comment">
                        <i className="fa-solid fa-message" />
                        <Link href="#">24 Comments</Link>
                    </li>
                </ul>
            </div>
            {props.image?
                <div className="dz-media rounded">
                    <Image src={IMAGES.BlogDetailPic1} alt="/"  className="w-100"/>
                </div>
                :
                ""
            }
        </Fragment>
    )
}