import Link from "next/link";
import IMAGES from "../../constant/theme";
import CommentForm from "./CommentForm";
import Image, { StaticImageData } from "next/image";
interface CommentType{
    image : string | StaticImageData;
    name:  string;
}

const CommentBlog : React.FC<CommentType> = ({ image, name }) => {
    return(
        <div className="comment-body">
            <div className="comment-author vcard">
                <Image src={image} alt="/" className="avatar" />
                <cite className="fn">{name}</cite> 
            </div>
            <div className="comment-content dz-page-text">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div className="reply">
                <Link href={"#"} rel="nofollow" className="comment-reply-link" >Reply</Link>
            </div>
        </div>
    )
}

export default function Comments(){
    return(
        <div className="post-comments comments-area style-1 clearfix">
            <h4 className="comments-title mb-2">Comments (02)</h4>
            <p className="dz-title-text">There are many variations of passages of Lorem Ipsum available.</p>
            <div id="comment">
                <ol className="comment-list">
                    <li className="comment even thread-even depth-1 comment" id="comment-2">                        
                        <CommentBlog image={IMAGES.ProfilePic} name="Michel Poe" />
                        <ol className="children">
                            <li className="comment byuser comment-author-w3itexpertsuser bypostauthor odd alt depth-2 comment" id="comment-3">
                                <CommentBlog image={IMAGES.ProfilePic3} name="Celesto Anderson" />                               
                            </li>
                        </ol>
                    </li>
                    <li className="comment even thread-odd thread-alt depth-1 comment" id="comment-4">
                        <CommentBlog image={IMAGES.ProfilePic2} name="Monsur Rahman Lito" />                        
                    </li>
                </ol>
            </div>
            <div className="default-form comment-respond style-1" id="respond">
                <h4 className="comment-reply-title mb-2" id="reply-title">Good Comments</h4>
                <p className="dz-title-text">There are many variations of passages of Lorem Ipsum available.</p>
                <div className="clearfix">
                    <CommentForm />
                </div>
            </div>
        </div>
    )
}