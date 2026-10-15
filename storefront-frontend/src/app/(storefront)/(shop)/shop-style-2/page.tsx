import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import Image, { StaticImageData } from "next/image";

interface shirtStyletype{
    image: string | StaticImageData;
    name: string;
}

const shirtStyleData : shirtStyletype[] = [
    { image : IMAGES.ShartShop1, name:'Printed Spread Collar Casual Shirt'},
    { image : IMAGES.ShartShop2, name:'Checkered Slim Collar Casual Shirt'},
    { image : IMAGES.ShartShop3, name:'Solid Cut Away Collar Casual Shirt'},
    { image : IMAGES.ShartShop4, name:'Printed Spread Collar Casual Shirt'},
    { image : IMAGES.ShartShop5, name:'Checkered Spread Collar Casual Shirt'},
];

export default function ShopStyle2(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner mainText="Shop Style 2" parentText="Home" currentText="Shop Style 2" image={IMAGES.BackBg1.src}/>
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row m-auto gx-xl-4 g-3 mb-xl-0 mb-md-0 mb-3 justify-content-center">
                            {shirtStyleData.map((item, index)=>(
                                <div className=" col-xl-4 col-lg-4 col-md-4 col-sm-6 m-md-b50 m-sm-b0 m-b70" key={index}>
                                    <div className="shop-card style-2 ">
                                        <div className="dz-media">
                                            <Image src={item.image} alt="shop" />
                                        </div>
                                        <div className="dz-content">
                                            <div>
                                                <span className="sale-title">up to 79% off</span>
                                                <h5 className="title"><Link href="/shop-list">{item.name}</Link></h5>
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
                </section>
            </div>
        </>
    )
}