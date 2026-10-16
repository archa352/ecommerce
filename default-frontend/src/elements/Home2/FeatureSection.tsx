import Link from "next/link";
import IMAGES from "../../constant/theme";
import CategoryRollup from "./CategoryRollup";
import Image from "next/image";

const CategoryProductData = [
    {anim :'0.2s',  coloumStyle:'col-xl-4', postion:'left product-1', name:'Jacket', image: IMAGES.CategoryPic1},
    {anim :'0.3s',  coloumStyle:'col-xl-3', postion:'left product-2', name:'Jeans', image: IMAGES.CategoryPic2},
    {anim :'0.4s',  coloumStyle:'col-xl-5', postion:'left product-3', name:'Shirts', image: IMAGES.CategoryPic3},
    {anim :'0.5s',  coloumStyle:'col-xl-4', postion:'right product-4', name:'Shorts', image: IMAGES.CategoryPic4},
    {anim :'0.6s',  coloumStyle:'col-xl-5', postion:'right product-5', name:'T-shirt', image: IMAGES.CategoryPic5},
    {anim :'0.7s',  coloumStyle:'col-xl-3', postion:'right product-6', name:'Blazer', image: IMAGES.CategoryPic6},
];

export default function FeatureSection() {
    return (
        <>
            <div className="container">
				<div className="row gx-xl-4 g-3">
                    {CategoryProductData.map((elem, index)=>(
                        <div className={`col-lg-4 col-md-4 col-6 wow fadeInUp ${elem.coloumStyle}`} data-wow-delay={elem.anim} key={index}>
                            <div className={`category-product ${elem.postion}`}>
                                <Link href="/shop-with-category">								
                                    <Image src={elem.image} alt={elem.name} />
                                    <div className="category-badge">{elem.name}</div>
                                </Link>
                            </div>
                        </div>
                    ))}										
				</div>
			</div>
			<Link className="icon-button" href="/shop-with-category">
				<div className="text-row word-rotate-box c-black border-white">
					<CategoryRollup />
					<svg className="badge__emoji" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
						<g clipPath="url(#clip0_161_568)">
						  <path d="M10.7239 31.3072L19.0059 39.5891C19.2696 39.8523 19.627 40.0001 19.9995 40.0001C20.3721 40.0001 20.7295 39.8523 20.9932 39.5891L29.2752 31.3072C29.4582 31.1236 29.5608 30.8748 29.5606 30.6156C29.5604 30.3564 29.4573 30.1078 29.274 29.9245C29.0907 29.7412 28.8421 29.6381 28.5829 29.6379C28.3237 29.6377 28.075 29.7404 27.8913 29.9234L20.9781 36.8368V0.978516C20.9781 0.718997 20.875 0.470108 20.6915 0.286601C20.508 0.103093 20.2591 0 19.9995 0C19.74 0 19.4911 0.103093 19.3076 0.286601C19.1241 0.470108 19.021 0.718997 19.021 0.978516V36.8368L12.1077 29.9234C11.9241 29.7404 11.6754 29.6377 11.4162 29.6379C11.1569 29.6381 10.9084 29.7412 10.7251 29.9245C10.5418 30.1078 10.4387 30.3564 10.4385 30.6156C10.4383 30.8748 10.5409 31.1236 10.7239 31.3072Z" fill="#000"/>
						</g>
						<defs>
						  <clipPath id="clip0_161_568">
							<rect width="40" height="40" fill="#000"/>
						  </clipPath>
						</defs>
					</svg>
				</div>
			</Link>
        </>
		
    )
}