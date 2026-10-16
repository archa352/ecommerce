import Link from "next/link";
import IMAGES from "../../constant/theme";

const SummerSaleBlog = () => {
    return (
        <div className="row product-style2 g-0">
            <div className="col-lg-6 col-md-12">
                <div className="product-box style-4">
                    <div className="product-media" style={{backgroundImage: `url(${IMAGES.ShopLargbnr1.src})`}}></div>
                    <div className="sale-box">
                        <div className="badge style-1 mb-1">Sale Up to 50% Off</div>	
                        <h2 className="sale-name">Summer<span>2024</span></h2>
                        <Link href="/shop-list" className="btn btn-outline-secondary btn-lg text-uppercase">Shop Now</Link>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-md-12">
                <div className="product-box style-4">
                    <div className="product-media" style={{backgroundImage: `url(${IMAGES.ShopLargbnr2.src})`}}></div>
                    <div className="product-content">
                        <div className="main-content">
                            <div className="badge style-1 mb-3">Sale Up to 50% Off</div>
                            <h2 className="product-name">New Summer Collection</h2>
                        </div>
                        <Link href="/shop-list" className="btn btn-secondary btn-lg text-uppercase">Shop Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummerSaleBlog;