import Image, { StaticImageData } from "next/image";

interface ProductTabtype{
    image1: string | StaticImageData;
    image2: string | StaticImageData;
    image3: string | StaticImageData;
}
export default function ProductTabStyleOne(props : ProductTabtype){
    return(
        <>
            <div className="detail-bx text-center">
                <h5 className="title">Flawless Denim Delights</h5>
                <p className="para-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <ul className="feature-detail">
                    <li>
                        <i className="icon feather icon-check"></i>
                        <h5>Versatile, enduring style for all occasions</h5>
                    </li>
                    <li>
                        <i className="icon feather icon-check"></i>
                        <h5>Handcrafted Elegance, Comfort</h5>
                    </li>
                    <li>
                        <i className="icon feather icon-check"></i>
                        <h5>Versatile, enduring style for all occasions</h5>
                    </li>
                </ul>
            </div>
            <div className="row g-lg-4 g-3">
                <div className="col-xl-4 col-md-4 col-sm-4 col-6">
                    <div className="related-img dz-media">
                        <Image src={props.image1} alt="/" />
                    </div>
                </div>
                <div className="col-xl-4 col-md-4 col-sm-4 col-6">
                    <div className="related-img dz-media">
                        <Image src={props.image2} alt="/" />
                    </div>
                </div>
                <div className="col-xl-4 col-md-4 col-sm-4">
                    <div className="related-img dz-media">
                        <Image src={props.image3} alt="/" />
                    </div>
                </div>
            </div>
        </>
    )
}