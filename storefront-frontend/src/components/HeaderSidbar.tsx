import Link from "next/link";
import ShopSidebar from "../elements/Shop/ShopSidebar";

export default function HeaderSidbar(){
    return(
        <div className="product-description">          
            <ShopSidebar />
            <Link href="#" className="btn btn-sm font-14 btn-secondary btn-sharp">RESET</Link>
        </div>
    )
}