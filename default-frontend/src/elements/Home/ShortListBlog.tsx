import SaleDiscountShopCard from "../../components/SaleDiscountShopCard";
import { GreatSavindData } from "../../constant/Alldata";

const ShortListBlog = () => {
    return (
        <div className="row">
            {GreatSavindData.map((data, ind)=>(
                <div className="col-lg-6 col-md-6 col-sm-6 m-b30" key={ind}>
                    <SaleDiscountShopCard image={data.image} name={data.name} star={data.star}/> 
                </div>
            ))}            
        </div>	
    );
};

export default ShortListBlog;