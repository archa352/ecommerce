import Link from "next/link";
import IMAGES from "@/constant/theme";
import AdditionalInfo from "@/elements/Post/AdditionalInfo";
import Comments from "@/elements/Post/Comments";
import PostTag from "@/elements/Post/PostTag";
import SocialIcon from "@/elements/SocialIcon";
import Image from "next/image";

export default function PostBanner(){
    return(
        <div className="page-wraper">
            <div className="page-content bg-light">
            {/* <!-- Blog Large --> */}
                <div className="section-full post-header blog-single style-1 mb-0">
                    <div className="dz-card text-center">
                        <div className="dz-media overlay-black-middle">
                            <Image src={IMAGES.BlogDetailPic2}  alt="blog" />			
                        </div>
                        <div className="dz-info">
                            <h1 className="text-white mx-auto">The Sustainable Wardrobe A Greener Approach To Fashion</h1>
                            <div className="dz-meta style-1">
                                <ul className="justify-content-center">
                                    <li className="post-date">10 May 2025</li>
                                    <li className="dz-user">
                                        <i className="fa-solid fa-user"/>
                                        By <Link href="#">KK Sharma</Link>
                                    </li>
                                    <li className="dz-comment">
                                        <i className="fa-solid fa-message"/>
                                        <Link href="#">24 Comments</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content-inner-3">
                    <div className="min-container">
                        {/* <!-- blog start --> */}
                        <div className="dz-blog blog-single style-1">
                            <div className="dz-info">
                                <div className="dz-post-text">
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"/></blockquote>
                                    
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>
                                    
                                    <figure className="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped alignwide">
                                        <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                        <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic2} alt="/" /></figure>
                                        <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic3} alt="/" /></figure>
                                        <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic4} alt="/" /></figure>
                                        <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                    </figure>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    <div className="dz-media alignfullwide m-b30">
                                        <Image src={IMAGES.BlogDetailPic3} alt="/" />
                                    </div>                                
                                    <AdditionalInfo />
                                </div>
                                <div className="dz-share-post meta-bottom">
                                    <PostTag />
                                    <div className="dz-social-icon primary-light">
                                        <ul>
                                            <SocialIcon />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clear" id="comment-list">
                            <Comments />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}