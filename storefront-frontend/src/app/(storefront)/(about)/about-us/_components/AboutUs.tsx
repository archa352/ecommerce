import Link from "next/link";
import TeamCreators from "@/elements/About/TeamCreators";
import UniqueFashionBlog from "@/elements/About/UniqueFashionBlog";


const AboutUs = () =>{
    return(
        <div className="page-content bg-light">	
            <section className="dz-bnr-inr dz-bnr-inr-sm bg-light">
                <div className="container">
                    <div className="dz-bnr-inr-entry ">
                        <div className="row align-items-center">
                            <div className="col-lg-7 col-md-7">
                                <div className="text-start mb-xl-0 mb-4">
                                    <h1>Your Fashion Journey Starts Here Discover Style at Pixio</h1>
                                    <nav aria-label="breadcrumb" className="breadcrumb-row">
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item"><Link href={"/"}> Home</Link></li>
                                            <li className="breadcrumb-item">About us</li>
                                        </ul>
                                    </nav>
                                </div>							
                            </div>
                            <div className="col-lg-5 col-md-5 ">
                                <div className="about-sale  text-start">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-6 col-6">
                                            <div className="about-content">
                                                <h2 className="title"><span className="counter">50</span>+</h2>
                                                <p className="text">Items Sale</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-5 col-md-6 col-6">
                                            <div className="about-content">
                                                <h2 className="title">400%</h2>
                                                <p className="text">Return on investment </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about-banner overflow-visible">
                <video autoPlay loop muted id="video-background">
                    <source src="/assets/images/background/bg-video.mp4" type="video/mp4" />
                </video>
                <div className="about-info">
                    <h3 className="dz-title">
                        <Link href="/about-me">why Pixio ?</Link>
                    </h3>
                    <p className="text mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use</p>
                </div>
            </section>
            <section className="content-inner">
                <UniqueFashionBlog />
            </section>
            <section className="get-in-touch">
                <div className="m-r100 m-md-r0 m-sm-r0">
                    <h3 className="dz-title mb-lg-0 mb-3">Questions ?
                        <span>Our experts will help find the grar that’s right for you</span>
                    </h3>
                </div>
                <Link href="/contact-us-1" className="btn btn-light">Get In Touch</Link>
            </section>
            <section className="content-inner">
			    <div className="container">
                    <TeamCreators /> 
                </div>
            </section>
        </div>
    )
}
export default AboutUs;