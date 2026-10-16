import Link from "next/link";
import IMAGES from "../../constant/theme";
import { GreatSavindData } from '../../constant/Alldata';
import SaleDiscountShopCard from '../../components/SaleDiscountShopCard';
import Image from "next/image";


const GreatSaving = () => {
    return (
        <div className="row ">
            <div className="col-lg-6 col-md-12 align-self-center">
                <div className="row">
                    {GreatSavindData.map((data, ind)=>(
                        <div className="col-lg-6 col-md-6 col-sm-6 m-b30" key={ind}>
                            <SaleDiscountShopCard image={data.image} name={data.name} star={data.star} />
                        </div>
                    ))}                    
                </div>	
            </div>
            <div className="col-lg-6 col-md-12 m-b30">
                <div className="about-box style-1  clearfix h-100 right">
                    <div className="dz-media h-100">
                        <Image src={IMAGES.AboutPic1} alt="" />
                        <div className="media-contant">
                            <h2 className="title">Great saving on everyday essentials</h2> 
                            <h5 className="sub-title">Up to 60% off + up to $107 cashBACK</h5>
                            <Link href="/shop-list" className="btn btn-white btn-lg">See all</Link>
                        </div>
                        <svg className="title animation-text" viewBox="0 0 1320 300">
                            <text x="0" y="">Great saving</text>
                        </svg>	
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreatSaving;