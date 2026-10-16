import Link from "next/link";
import { SVGICON } from "../constant/theme";
import { modalCategoryBlog, modalCategoryBlog2 } from "../constant/Alldata";
import ProductInputButton from "../elements/Shop/ProductInputButton";

export default function BasicModalData(){
    return(
        <>
            <div className="dz-product-detail style-2 ps-xl-3 ps-0 pt-2 mb-0">
                <div className="dz-content">
                    <div className="dz-content-footer">
                        <div className="dz-content-start">
                            <span className="badge bg-secondary mb-2">SALE 20% Off</span>
                            <h4 className="title mb-1"><Link href="/shop-list">Cozy Knit Cardigan Sweater</Link></h4>
                            <div className="review-num">
                                <ul className="dz-rating me-2">
                                    <li className="star-fill">
                                        <i className="flaticon-star-1"/>
                                    </li>										
                                    <li className="star-fill">
                                        <i className="flaticon-star-1"/>
                                    </li>
                                    <li className="star-fill">
                                        <i className="flaticon-star-1"/>
                                    </li>
                                    <li>
                                        <i className="flaticon-star-1"/>
                                    </li>
                                    <li>
                                        <i className="flaticon-star-1"/>
                                    </li>
                                </ul>
                                <span className="text-secondary me-2">4.7 Rating</span>
                                <Link href="#">(5 customer reviews)</Link>
                            </div>
                        </div>
                    </div>
                    <p className="para-text">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has.
                    </p>
                    <div className="meta-content m-b20 d-flex align-items-end">
                        <div className="me-3">
                            <span className="form-label">Price</span>
                            <span className="price">$125.75 <del>$132.17</del></span>
                        </div>                                                
                        <div className="btn-quantity light me-0">
                            <label className="form-label">Quantity</label>
                            <ProductInputButton />
                        </div>
                    </div>
                    <div className=" cart-btn">
                        <Link href="/shop-cart" className="btn btn-secondary text-uppercase">Add To Cart</Link>
                        <Link href="/shop-wishlist" className="btn btn-md btn-outline-secondary btn-icon">                            
                            <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{__html : SVGICON.BlankHeart}}></svg>
                            Add To Wishlist
                        </Link>
                    </div>
                    <div className="dz-info mb-0">
                        <ul>
                            <li><strong>SKU:</strong></li>
                            <li>PRT584E63A</li>
                        </ul>
                        <ul>
                            <li><strong>Category:</strong></li>
                            {modalCategoryBlog.map((elem, ind)=>(
                                <li key={ind}><Link href="/shop-standard">{elem.name}</Link></li>
                            ))}
                        </ul>
                        <ul>
                            <li><strong>Tags:</strong></li>
                            {modalCategoryBlog2.map((elem, ind)=>(
                                <li key={ind}><Link href="/shop-standard">{elem.name}</Link></li>
                            ))}                                                    
                        </ul>
                        <div className="dz-social-icon">
                            <ul>
                                <li><Link target="_blank" className="text-dark" href="https://www.facebook.com/dexignzone">
                                    <i className="fab fa-facebook-f"/>
                                </Link></li>
                                <li><Link target="_blank" className="text-dark" href="https://twitter.com/dexignzones">	
                                    <i className="fab fa-twitter"/>
                                </Link></li>
                                <li><Link target="_blank" className="text-dark" href="https://www.youtube.com/@dexignzone1723">
                                    <i className="fa-brands fa-youtube"/>
                                </Link></li>
                                <li><Link target="_blank" className="text-dark" href="https://www.linkedin.com/showcase/3686700/admin/">
                                    <i className="fa-brands fa-linkedin-in"/>
                                </Link></li>
                                <li><Link target="_blank" className="text-dark" href="https://www.instagram.com/dexignzone/">
                                    <i className="fab fa-instagram"/>
                                </Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}