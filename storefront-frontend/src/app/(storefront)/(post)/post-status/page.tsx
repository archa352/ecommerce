"use client"

import { Modal } from "react-bootstrap"
import Image from "next/image"
import IMAGES from "@/constant/theme"
import BlogSidebar from "@/elements/Blog/BlogSidebar"
import AdditionalInfo from "@/elements/Post/AdditionalInfo"
import AuthorProfile from "@/elements/Post/AuthorProfile"
import Comments from "@/elements/Post/Comments"
import PostTag from "@/elements/Post/PostTag"
import PostTitleWithImage from "@/elements/Post/PostTitleWithImage"
import RelatedPost from "@/elements/Post/RelatedPost"
import SocialIcon from "@/elements/SocialIcon"
import StatusSlider from "@/elements/Post/StatusSlider"
import { useState } from "react"


export default function PostStatus(){
    const [statusModel, setStatusModel] = useState(false);
    return(
        <>
            <>
                <div className="page-content bg-light">
                    <section className="content-inner z-index-unset">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-xl-8 col-lg-8 m-b30">
                                    <div className="dz-blog blog-single style-1 sidebar">
                                        <PostTitleWithImage image={false} />
                                        <div className="dz-media rounded position-relative">
                                            <Image src={IMAGES.BlogDetailPic1} alt="/" />
                                            <button type="button" className="post-status-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                                onClick={()=>setStatusModel(true)}
                                            >                                        
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.8988 10.8238L7.875 2.14375C7.44554 1.88967 6.95647 1.75382 6.4575 1.75C5.67312 1.75 4.92087 2.06159 4.36623 2.61623C3.81159 3.17087 3.5 3.92312 3.5 4.7075V23.3363C3.5001 23.8568 3.63963 24.3678 3.90409 24.8161C4.16855 25.2644 4.54829 25.6337 5.0038 25.8856C5.45932 26.1375 5.974 26.2627 6.49432 26.2483C7.01464 26.2339 7.5216 26.0804 7.9625 25.8038L23.0038 16.3013C23.4714 16.0086 23.8553 15.5997 24.118 15.1145C24.3807 14.6293 24.5132 14.0844 24.5026 13.5328C24.492 12.9811 24.3387 12.4417 24.0577 11.9669C23.7766 11.4922 23.3773 11.0983 22.8988 10.8238Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="dz-info">
                                            <div className="dz-post-text">                                                                              
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"></i></blockquote>
                                                
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                <figure className="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped">
                                                    <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                                    <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic2} alt="/" /></figure>
                                                    <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic3} alt="/" /></figure>
                                                    <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic4} alt="/" /></figure>
                                                    <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                                </figure>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
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
                                <div className="col-xl-4 col-lg-4 col-md-8 m-b30">
                                    <aside className="side-bar sticky-top">
                                        <BlogSidebar />
                                    </aside>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
            <Modal className="status-modal" 
                id="staticBackdrop"
                centered 
                data-bs-backdrop="static" 
                data-bs-keyboard="false" 
                tabIndex={-1} show={statusModel} onHide={()=>setStatusModel(false)}
            >
                <button type="button" className="btn-close" onClick={()=>setStatusModel(false)}></button>                 
                <div className="status-pagination"></div>                
                <div className="modal-body p-0">
                    <div className="status-wrapper">                                
                        <StatusSlider />
                    </div>
                </div>
            </Modal>
        </>
    )
}
