import { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface cardType{
    image: string | StaticImageData;
    title : string;
    price?: string;    
    showdetailModal? : (() => void | undefined) | undefined;
}


export default function ShopGridCard(props: cardType){
    const [heartIcon, setHeartIcon] = useState(false);
    const [basketIcon, setBasketIcon] = useState(false);
    return(
        <div className="shop-card style-1">
            <div className="dz-media">
                <Image src={props.image} alt="shop" />
                <div className="shop-meta">
                    <Link href={"#"} className="btn btn-secondary btn-md btn-rounded" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        onClick={props.showdetailModal}
                    >
                        <i className="fa-solid fa-eye d-md-none d-block"/>
                        <span className="d-md-block d-none">Quick View</span>
                    </Link>
                    <div className={`btn btn-primary meta-icon dz-wishicon ${heartIcon ? "active": ""}`}
                        onClick={()=>setHeartIcon(!heartIcon)}
                    >
                        <i className="icon feather icon-heart dz-heart"/>
                        <i className="icon feather icon-heart-on dz-heart-fill"/>
                    </div>
                    <div className={`btn btn-primary meta-icon dz-carticon  ${basketIcon ? "active": ""}`}
                        onClick={()=>setBasketIcon(!basketIcon)}
                    >
                        <i className="flaticon flaticon-basket"/>
                        <i className="flaticon flaticon-shopping-basket-on dz-heart-fill"/>
                    </div>
                </div>							
            </div>
            <div className="dz-content">
                <h5 className="title"><Link href="/shop-list">{props.title}</Link></h5>
                <h5 className="price">{props.price}</h5>
            </div>
            <div className="product-tag">
                <span className="badge ">Get 20% Off</span>
            </div>
        </div>
    )
}