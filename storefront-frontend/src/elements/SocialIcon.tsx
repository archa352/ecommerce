import Link from "next/link";

export default function SocialIcon(){
    return(
        <ul>
            <li>
                <Link href="https://www.facebook.com/dexignzone" target="_blank">
                    <i className="fa-brands fa-facebook-f"/>
                </Link>
            </li>
            <li>
                <Link href="https://www.linkedin.com/showcase/3686700/admin/" target="_blank">
                    <i className="fa-brands fa-linkedin"/>
                </Link>
            </li>
            <li>
                <Link href="https://www.behance.net/dexignzone" target="_blank">
                    <i className="fa-brands fa-behance"/>
                </Link>
            </li>
            <li>
                <Link href="https://www.instagram.com/dexignzone/" target="_blank">
                    <i className="fa-brands fa-instagram"/>
                </Link>
            </li>
        </ul>
    )
}