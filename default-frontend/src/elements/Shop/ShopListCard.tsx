import Image from "next/image";
import Link from "next/link";

interface varibleType{
    image : string;
    title : string;
    price? : string;
    inputtype? : string;
}

export default function ShopListCard(props: varibleType){
    return(
        <div className="dz-shop-card style-2">
            <div className="dz-media">
                <Image src={props.image} alt="shop" />
            </div>
            <div className="dz-content">
                <div className="dz-header">
                    <div>
                        <h4 className="title mb-0"><Link href="/shop-list">{props.title}</Link></h4>
                        <ul className="dz-tags">
                            <li><Link href="/shop-with-category">Accessories,</Link></li>
                            <li><Link href="/shop-with-category">Sunglasses</Link></li>
                        </ul>
                    </div>
                    <div className="review-num">
                        <ul className="dz-rating">
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
                        <span><Link href="#"> 250 Review</Link></span>
                    </div>
                </div>
                <div className="dz-body">
                    <div className="dz-rating-box">
                        <div>
                            <p className="dz-para">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has.</p>
                        </div>
                    </div>
                    <div className="rate">
                        <div className="d-flex align-items-center mb-xl-3 mb-2">
                            <div className="meta-content m-0">
                                <span className="price-name">Price</span>
                                <span className="price">{props.price}</span>
                            </div>
                        </div>
                        <div className="d-flex">
                            <Link href="/shop-cart" className="btn btn-secondary btn-md btn-icon">
                                <i className="icon feather icon-shopping-cart d-md-none d-block"/>
                                <span className="d-md-block d-none">Add to cart</span>
                            </Link>
                            <div className="bookmark-btn style-1">
                                <input className="form-check-input" type="checkbox" id={props.inputtype} />
                                <label className="form-check-label" htmlFor={props.inputtype}>
                                    <i className="fa-solid fa-heart"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}