import Link from "next/link";
import IMAGES from "@/constant/theme";
import Image from "next/image";

const shopCardStyle = [
    { title:"Flawless Denim Delights", image : IMAGES.ShopPorductPng1,},
    { title:"Flawless Denim Delights", image : IMAGES.ShopPorductPng2,},
    { title:"Flawless Denim Delights", image : IMAGES.ShopPorductPng3,},
];

const ShopComparePage = () =>{
    return(
        <div className="page-wraper">
            <div className="page-content bg-light">
                <div className="dz-bnr-inr bg-secondary dz-bnr-inr-md">
                    <div className="container-fluid">
                        <div className="dz-bnr-inr-entry text-start">
                            <h1>Compare</h1>
                            <nav aria-label="breadcrumb" className="breadcrumb-row">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Compare</li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="content-inner-1 bg-light">
                    <div className="container-fluid">
                        <div className="table-responsive overflow-visible">
                            <table className="table compare-table">
                                <tbody>
                                    <tr className="compare-product">
                                        <td></td>
                                        {shopCardStyle.map((item, ind)=>(
                                            <td key={ind}>
                                                <div className="shop-card style-8">
                                                    <div className="dz-media">
                                                        <Image src={item.image} alt="shop" />
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="title"><Link href="#">{item.title}</Link></h5>
                                                        <ul className="star-rating">
                                                            <li>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.24805 0.734375L9.22301 5.01608L13.9054 5.57126L10.4436 8.77267L11.3625 13.3975L7.24805 11.0944L3.13355 13.3975L4.0525 8.77267L0.590651 5.57126L5.27309 5.01608L7.24805 0.734375Z" fill="#FF8A00"/>
                                                                </svg>
                                                            </li>
                                                            <li>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.24805 0.734375L9.22301 5.01608L13.9054 5.57126L10.4436 8.77267L11.3625 13.3975L7.24805 11.0944L3.13355 13.3975L4.0525 8.77267L0.590651 5.57126L5.27309 5.01608L7.24805 0.734375Z" fill="#FF8A00"/>
                                                                </svg>
                                                            </li>
                                                            <li>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.24805 0.734375L9.22301 5.01608L13.9054 5.57126L10.4436 8.77267L11.3625 13.3975L7.24805 11.0944L3.13355 13.3975L4.0525 8.77267L0.590651 5.57126L5.27309 5.01608L7.24805 0.734375Z" fill="#FF8A00"/>
                                                                </svg>
                                                            </li>
                                                            <li>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.24805 0.734375L9.22301 5.01608L13.9054 5.57126L10.4436 8.77267L11.3625 13.3975L7.24805 11.0944L3.13355 13.3975L4.0525 8.77267L0.590651 5.57126L5.27309 5.01608L7.24805 0.734375Z" fill="#E4E5E8"/>
                                                                </svg>
                                                            </li>
                                                            <li>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.24805 0.734375L9.22301 5.01608L13.9054 5.57126L10.4436 8.77267L11.3625 13.3975L7.24805 11.0944L3.13355 13.3975L4.0525 8.77267L0.590651 5.57126L5.27309 5.01608L7.24805 0.734375Z" fill="#E4E5E8"/>
                                                                </svg>
                                                            </li>
                                                        </ul>
                                                        <h6 className="price">
                                                            <del>$45.00</del>
                                                            $40.00
                                                        </h6>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}                                       
                                        <td>
                                            <div className="shop-card style-8">
                                                <div className="dz-media">
                                                    <Image src={IMAGES.uploadpic} alt="upload" />
                                                </div>
                                                <div className="dz-content">
                                                    <h5 className="title"><Link href="#">Add Product</Link></h5>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="compare-table-head">
                                        <td><h5>Technical Details</h5></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr className="compare-start">
                                        <td>Brand</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Speedex</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Speedex</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Speedex</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Speedex</td>
                                    </tr>
                                    <tr>
                                        <td>Material</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Stainless Steel</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Stainless Steel</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Stainless Steel</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Stainless Steel</td>
                                    </tr>
                                    
                                    <tr>
                                        <td>Bottle Type</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Sipper Bottle</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Sipper Bottle</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Sipper Bottle</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Sipper Bottle</td>
                                    </tr>
                                    <tr>
                                        <td>Colour</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Black</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Black </td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Black</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Black</td>
                                    </tr>
                                    <tr>
                                        <td>Capacity</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1000 Milliliters</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>1000 Milliliters</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1000 Milliliters</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1000 Milliliters</td>
                                    </tr>
                                    <tr>
                                        <td>Special Feature</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Shatter Proof, Leak Proof</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Shatter Proof, Leak Proof</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Shatter Proof, Leak Proof</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Shatter Proof, Leak Proof</td>
                                    </tr>
                                    <tr>
                                        <td>Age Range (Description)</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Adult</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Adult</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Adult</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Adult</td>
                                    </tr>
                                    <tr>
                                        <td>Product Dimensions</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7W x 26H Centimeters</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7W x 26H Centimeters</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7W x 26H Centimeters</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7W x 26H Centimeters</td>
                                    </tr>
                                    <tr>
                                        <td>Product Care Instructions</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>WASH WITH WARM WATER </td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>WASH WITH WARM WATER </td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>WASH WITH WARM WATER </td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>WASH WITH WARM WATER </td>
                                    </tr>
                                    <tr>
                                        <td>Model Name</td>
                                        <td><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000ml</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000ml</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000ml</td>
                                        <td><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000ml</td>
                                    </tr>
                                    <tr>
                                        <td>Recommended Uses For Product</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Office, School, Picnic, Gym</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Office, School, Picnic, Gym</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Office, School, Picnic, Gym</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Office, School, Picnic, Gym</td>
                                    </tr>
                                    <tr>
                                        <td>Number of Items</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>1</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1</td>
                                    </tr>
                                    <tr>
                                        <td>Reusability</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Reusable</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Reusable</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Reusable</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Reusable</td>
                                    </tr>
                                    <tr>
                                        <td>Shape</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Round</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Round</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Round</td>
                                        <td><span><i className="fa-solid fa-check"/></span>Round</td>
                                    </tr>
                                    <tr>
                                        <td>Net Quantity</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                    </tr>
                                    <tr>
                                        <td>Country of Origin</td>
                                        <td><span><i className="fa-solid fa-check"/></span>India</td>
                                        <td><span><i className="fa-solid fa-check"/></span>India</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>India</td>
                                        <td><span><i className="fa-solid fa-check"/></span>India</td>
                                    </tr>
                                    <tr>
                                        <td>Item model number</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000m</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000m</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000m</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>SIMP_WithSipp-1000m</td>
                                    </tr>
                                    <tr>
                                        <td>Product Dimensions</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7 x 7 x 26 cm; 260 Grams</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7 x 7 x 26 cm; 260 Grams</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>7 x 7 x 26 cm; 260 Grams</td>
                                        <td><span><i className="fa-solid fa-check"/></span>7 x 7 x 26 cm; 260 Grams</td>
                                        
                                    </tr>
                                    <tr className="compare-end">
                                        <td>ASIN</td>
                                        <td><span><i className="fa-solid fa-check"/></span>B08FYVDRNK</td>
                                        <td><span><i className="fa-solid fa-check"/></span>B08FYVDRNK</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>B08FYVDRNK</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>B08FYVDRNK</td>
                                    </tr>
                                    <tr className="compare-table-head">
                                        <td><h5>Additional Information</h5></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr  className="compare-start">
                                        <td>Item Weight</td>
                                        <td><span><i className="fa-solid fa-check"/></span>260 g</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>260 g</td>
                                        <td><span><i className="fa-solid fa-check"/></span>260 g</td>
                                        <td><span><i className="fa-solid fa-check"/></span>260 g</td>
                                        
                                    </tr>
                                    <tr>
                                        <td>Item Dimensions</td>
                                        <td><span><i className="fa-solid fa-check"/></span>LxWxH	7 x 7 x 26 CM</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>LxWxH	7 x 7 x 26 CM</td>
                                        <td><span><i className="fa-solid fa-check"/></span>LxWxH	7 x 7 x 26 CM</td>
                                        <td><span><i className="fa-solid fa-check"/></span>LxWxH	7 x 7 x 26 CM</td>	
                                    </tr>
                                    <tr>
                                        <td>Net Quantity</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>1 count</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 count</td>
                                    </tr>
                                    <tr>
                                        <td>Included Components	</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 Water Bottle</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 Water Bottle</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>1 Water Bottle</td>
                                        <td><span><i className="fa-solid fa-check"/></span>1 Water Bottle</td>
                                    </tr>
                                    <tr>
                                        <td>Generic Name</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Water Bottles</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Water Bottles</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Water Bottles</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>Water Bottles</td>
                                    </tr>
                                    <tr className="compare-end">
                                        <td>Best Sellers Rank</td>
                                        <td><span><i className="fa-solid fa-check"/></span>#323 in Home & Kitchen</td>
                                        <td><span><i className="fa-solid fa-check"/></span>#323 in Home & Kitchen</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>#323 in Home & Kitchen</td>
                                        <td className="disable"><span><i className="fa-solid fa-check"/></span>#323 in Home & Kitchen</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <section className="content-inner companies bg-light p-t0">
                    <div className="container">
                        <div className="section-inner">
                            <div className="section-head style-3 wow fadeInUp" data-wow-delay="0.1s">
                                <h2 className="title">We’re just keep growing with 6.3k trusted companies</h2>
                                <p>Nullam nec ipsum luctus, vehicula massa in, dictum sapien. Aenean quis luctus ert nulla quam augue.</p>	
                            </div>
                            <div className="row gx-3 companies-inner">
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.1s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo1} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.2s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo2} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.3s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo3} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.4s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo4} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.5s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo5} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.6s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo6} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.7s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo7} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20 wow fadeInUp" data-wow-delay="0.8s">
                                    <Link href={"#"} className="companies-wrapper">
                                        <div className="companies-media">
                                            <Image src={IMAGES.CompaniesLogo8} alt="" /> 
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default ShopComparePage;