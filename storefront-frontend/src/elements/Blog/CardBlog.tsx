import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

interface cardblogtype{
    image : string;
    date : string;
    text : string;
}

export default function CardBlog(props : cardblogtype){
    return(
        <Fragment>
            <div className="dz-media">
                <Image src={props.image} alt="/" />
            </div>
            <div className="dz-info">
                <div className="dz-meta">
                    <ul>
                        <li className="post-date">{props.date}</li>
                    </ul>
                </div>
                <h3 className="dz-title">
                    <Link href="/post-standard">{props.text}</Link>
                </h3>
                <Link href="/post-standard" className="font-14 mt-auto read-btn">Read More 
                    <i className="icon feather icon-chevron-right"/>
                </Link>
            </div>
        </Fragment>
    )
}