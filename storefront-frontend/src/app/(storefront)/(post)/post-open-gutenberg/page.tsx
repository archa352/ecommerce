import IMAGES from "@/constant/theme"
import AuthorProfile from "@/elements/Post/AuthorProfile"
import Comments from "@/elements/Post/Comments"
import PostTag from "@/elements/Post/PostTag"
import RelatedPost from "@/elements/Post/RelatedPost"
import SocialIcon from "@/elements/SocialIcon"
import Image from "next/image"

const PostGutenbergPage= () => {
    return(
        <>
            <div className="page-content bg-light">
		
                <section className="content-inner-3">
                    <div className="min-container">
        
                        <div className="dz-blog blog-single style-1">
                            <div className="post-header">
                                <h1 className="dz-title">The Sustainable Wardrobe A Greener Approach to Fashion</h1>
                                <div className="dz-meta">
                                    <ul className="justify-content-center">
                                        <li className="post-date">17 May 2024</li>
                                        <li className="dz-user">
                                            <i className="fa-solid fa-user"></i>
                                            By <a href="javascript:void(0);">KK Sharma</a>
                                        </li>
                                        <li className="dz-comment">
                                            <i className="fa-solid fa-message"></i>
                                            <a href="javascript:void(0);">24 Comments</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="dz-media alignfullwide">
                                <Image src={IMAGES.BlogDetailPic2} alt="/" />
                            </div>
                            <div className="dz-info">
                                <div className="dz-post-text">
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"></i></blockquote>
                                    
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
                                    
                                    <h3 className="dz-title">Additional information </h3>
                                    <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    
                                    <ul className="list-check-2 check-circle">
                                        <li>Sustainable Materials and Eco-Friendly Fabrics</li>
                                        <li>Promoting Fair Labor Practices in Fashion</li>
                                        <li>The Three R's in Sustainable Fashion</li>
                                        <li>Capsule Wardrobes Curating Timeless Style</li>
                                        <li>Transparency in Fashion Supply Chains</li>
                                        <li>Vegan and Cruelty-Free Fashion Alternatives</li>
                                    </ul>
                                    
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                    
                                </div>
                                <div className="dz-share-post meta-bottom">
                                    <div className="post-tags">
                                        <PostTag />
                                    </div>
                                    <div className="dz-social-icon primary-light">
                                        <SocialIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        <div className="author-box style-1">
                            <AuthorProfile />
                        </div>
                        <div className="dz-related-post">
                            <RelatedPost />
                        </div>	
                            
                        <div className="clear" id="comment-list">
                            <Comments />
                        </div>          
                    </div>
                </section>
                
            </div>
        </>
    )
}

export default PostGutenbergPage;