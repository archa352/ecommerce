
import IMAGES, { SVGICON } from "../../constant/theme";
import Link from "next/link";
import ProductRollup from '../../components/ProductRollup';
import Image from "next/image";


const singleProductData = [
    {name: 'Cozy Knit Cardigan Sweater', image:IMAGES.ShopPorductPng1},
    {name: 'Sophisticated Swagger Suit', image:IMAGES.ShopPorductPng2},
    {name: 'Classic Denim Skinny Jeans', image:IMAGES.ShopPorductPng3},
]

const AllProduction = () => {
    return (
       <div className="row  align-items-xl-center align-items-start">
            <div className=" col-lg-5 col-md-12 m-b30 align-self-center">
                <div className="dz-media style-1 img-ho1">
                    <Image src={IMAGES.AboutPic3} alt="shop" />
                </div>
            </div>	
            <div className="col-lg-7 col-md-12 col-sm-12">
                <div className="row justify-content-between align-items-center">
                    <div className="col-lg-8 col-md-8 col-sm-12">
                        <div className="section-head style-1">
                            <div className="left-content">
                                <h2 className="title">Users Who Viewed This Also Checked Out These Similar Profiles</h2>
                            </div>
                        </div>	
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 text-md-end" >	
                        <Link href="/shop-standard" className="icon-button d-md-block d-none ms-md-auto m-b30" >
                            <div className="text-row word-rotate-box c-black">
                                <ProductRollup />
                                <svg className="badge__emoji" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"
                                    dangerouslySetInnerHTML={{__html : SVGICON.ArrowRightSvg}}
                                ></svg>
                                
                            </div>
                        </Link>
                    </div>	
                </div>
                <div className="row">
                    {singleProductData.map(({name, image},ind)=>(
                        <div className="col-lg-4 col-md-4 col-sm-6 m-b15" key={ind}>
                            <div className="shop-card style-5">
                                <div className="dz-media"><Image src={image} alt="shop" /></div>
                                <div className="dz-content">
                                    <div>
                                        <span className="sale-title">up to 79% off</span>
                                        <h6 className="title"><Link href="/shop-list">{name}</Link></h6>
                                    </div>
                                    <h6 className="price">
                                        $80
                                        <del>$95</del>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    ))}                    
                </div>	
            </div>
        </div>
    );
};

export default AllProduction;