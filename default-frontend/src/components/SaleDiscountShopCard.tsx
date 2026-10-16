import Link from "next/link";
import IMAGES from "../constant/theme";
import Image, { StaticImageData } from "next/image";


interface propsValue {
    name : string
    image :  string | StaticImageData;
    star?:  string
}

const SaleDiscountShopCard = ({name, image, star} : propsValue) => {
    return (
        <div className="shop-card style-3">
            <div className="dz-media">
                <Image src={image} alt="shop-1" />
            </div>
            <div className="dz-content">
                <div>
                    {star === "star" ?
                        <span className="sale-title text-success">Free delivery</span>
                        :
                        <span className="sale-title">up to 79% off</span>
                    }
                    <h6 className="title"><Link href="/shop-list">{name}</Link></h6>
                </div>
                <h6 className="price">
                    $80
                    <del>$95</del>
                </h6>
            </div>
            {
                star === "star" ? <span className="sale-badge">50%<br />Sale <Image src={IMAGES.starpng} alt="" /></span> : ''
            }
                
        </div>
    );
};

export default SaleDiscountShopCard;