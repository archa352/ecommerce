import IMAGES from "@/constant/theme";
import BlogSidebar from "@/elements/Blog/BlogSidebar";
import AdditionalInfo from "@/elements/Post/AdditionalInfo";
import AuthorProfile from "@/elements/Post/AuthorProfile";
import Comments from "@/elements/Post/Comments";
import PostTag from "@/elements/Post/PostTag";
import PostTitleWithImage from "@/elements/Post/PostTitleWithImage";
import RelatedPost from "@/elements/Post/RelatedPost";
import SocialIcon from "@/elements/SocialIcon";
import Image from "next/image";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

export default function PostCateloge(){
    return(
        <>
            <div className="page-content bg-light">
                <section className="content-inner z-index-unset">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-8 m-b30">

                                <div className="dz-blog blog-single style-1 sidebar">
                                <PostTitleWithImage image={true} />
                                    <div className="dz-info">
                                        <div className="dz-post-text">
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <div className="dz-post-text text">
                                                <div>
                                                    <h4>01. Aenean hendrerit semin magna cursus lacinia.</h4>
                                                    <figure className="aligncenter">
                                                        <Image src={IMAGES.BlogPost1Pic5} alt="" className="w-100 rounded" />
                                                    </figure>
                                                    <div className="d-flex cateloge">
                                                        <table>
                                                            <thead>                                                                
                                                                <tr>
                                                                    <th>Launch Date</th>
                                                                    <th>4 January 2025, Well Documented</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>                                                               
                                                                <tr>
                                                                    <td>Layout</td>
                                                                    <td>Responsive</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>High Resolution</td>
                                                                    <td className="text-primary">yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Compatible Browsers</td>
                                                                    <td>IE11, Firefox, Safari, Opera, Chrome, Edge</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Regular Updated</td>
                                                                    <td className="text-primary">yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Rating</td>
                                                                    <td>5 Star</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="load-more-btn text-center">
                                                            <button className="btn btn-primary radius-xl me-1">Buy Now</button>
                                                            <button className="btn btn-secondary radius-xl">Preview</button>
                                                        </div>
                                                    </div>	
                                                    
                                                </div>
                                                <hr />
                                                <div>
                                                    <h4>02. Aenean hendrerit semin magna cursus lacinia.</h4>
                                                    <figure className="aligncenter">
                                                        <Image src={IMAGES.BlogPost1Pic1} alt="blog" className="w-100 rounded"/>
                                                    </figure>
                                                    <div className="d-flex cateloge">
                                                        <table>
                                                            <thead>                                                                
                                                                <tr>
                                                                    <th>Launch Date</th>
                                                                    <th>4 February 2025, Well Documented</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>                                                               
                                                                <tr>
                                                                    <td>Layout</td>                                                                    
                                                                    <td>Responsive</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>High Resolution</td>
                                                                    <td className="text-primary" >yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Compatible Browsers</td>
                                                                    <td>IE11, Firefox, Safari, Opera, Chrome, Edge</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Regular Updated</td>
                                                                    <td className="text-primary">yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Rating</td>
                                                                    <td>5 Star</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="load-more-btn text-center">
                                                            <button className="btn btn-primary radius-xl me-1">Buy Now</button>
                                                            <button className="btn btn-secondary radius-xl">Preview</button>
                                                        </div>
                                                    </div>	
                                                </div>
                                                <hr/>
                                                <div>
                                                    <h4>03. Aenean hendrerit semin magna cursus lacinia.</h4>
                                                    <figure className="aligncenter">
                                                        <Image src={IMAGES.BlogPost1Pic4} alt="blog" className="w-100 rounded" />
                                                    </figure>
                                                    <div className="d-flex cateloge">
                                                        <table>
                                                            <thead>                                                                
                                                                <tr>
                                                                    <th>Launch Date</th>
                                                                    <th>4 March 2025, Well Documented</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>                                                               
                                                                <tr>
                                                                    <td>Layout</td>
                                                                    <td>Responsive</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>High Resolution</td>
                                                                    <td className="text-primary">yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Compatible Browsers</td>
                                                                    <td>IE11, Firefox, Safari, Opera, Chrome, Edge</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Regular Updated</td>
                                                                    <td className="text-primary">yes</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Rating</td>
                                                                    <td>5 Star</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="load-more-btn text-center">
                                                            <button className="btn btn-primary radius-xl me-1">Buy Now</button>
                                                            <button className="btn btn-secondary radius-xl">Preview</button>
                                                        </div>
                                                    </div>	
                                                </div>
                                                <hr/>

                                                <h4>Aenean hendrerit semin magna cursus lacinia.</h4>
                                                <p>Nulla facilisi. Donec sodales diam enim, a dignissim nunc facilisis nec. Pellentes tellus lorem. Phasellus ultrices consectetur magna, ut gravida arcu pulvinar sit amet. Vivamus ultrices porttitor mauris, at mattis neque elementum vel. Suspendisse magna sapien, dignissim vel tortor ut, hendrerit pellentesque velit. Mauris porttitor maximus gilla massa imperdiet in. </p>
                                                <p>Donec sed lacus eu massa commodo interdum non id mauris. Etiam eu dignissim elit. Nulla cursus neque adictum quam tristique ac. Pellentesque habitant morbi tristique senectus et netus lalesuada fames ac turpis egestas. Donec ornare enim felis, non faucibus eros mattis vel. Suspendisse sollicitudin, nisi non interdum pharetra, libero lectus sollicitudin est, quis imperdiet nibh nulla non metus. Fusce accumsan in leo eu porttitor. Sed eget neque aliquam sequat bibendum.</p>
                                            </div>

                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"></i></blockquote>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                            <figure className="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped">
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="block1" /></figure>
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic2} alt="block2" /></figure>
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic3} alt="block3" /></figure>
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic4} alt="block4" /></figure>
                                                <figure className="wp-block-image size-large"><Image src={IMAGES.BlogPost3Pic1} alt="block5" /></figure>
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
    )
}