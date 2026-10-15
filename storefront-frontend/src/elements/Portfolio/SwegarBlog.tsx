import Link from "next/link";
import IMAGES from "../../constant/theme";
import Image from "next/image";

export default function SwegarBlog(){
    return(
        <div className="row">
            <div className="col-xl-12">
                <div className="post-pagination style-1">
                    <div className="post-prev">
                        <Link href="/portfolio-details-5" className="post-inner">
                            <div className="inner-icon">
                                <i className="icon feather icon-chevron-left" />
                            </div>
                            <div className="dz-media me-3">
                                <Image src={IMAGES.PaginationPost1} alt="post" />
                            </div>
                            <div className="dz-info m-0">
                                <span>Swagger</span>
                                <h6 className="m-b0">Sophisticated Swagger Suit</h6>
                            </div>
                        </Link>
                    </div>
                    <div className="post-next">
                        <Link href="/portfolio-details-2" className="post-inner">
                            <div className="dz-info">
                                <span>Sweater</span>
                                <h6 className="m-b0">Cozy Knit Cardigan Sweater</h6>
                            </div>
                            <div className="dz-media">
                                <Image src={IMAGES.PaginationPost2} alt="post" />
                            </div>
                            <div className="inner-icon">
                                <i className="icon feather icon-chevron-right" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}