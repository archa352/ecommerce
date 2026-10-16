import Link from "next/link";
import ContactFormBlog from "@/elements/ContactFormBlog";

const ContactUs = () => {
    return (        
        <div className="page-content bg-light">
            <div className="contact-bnr bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="contact-info style-1 text-start text-white">
                                <h2 className="title wow fadeInUp" data-wow-delay="0.1s">DISCOVER US</h2>
                                <p className="text wow fadeInUp" data-wow-delay="0.2s">
                                    <span className="text-decoration-underline">
                                        <Link href="/our-team">Pixio is here to help you;</Link>
                                    </span> 
                                    <br /> 
                                    Our experts are available to answer any questions you might have. We’ve got the answers.</p>
                                <div className="contact-bottom wow fadeInUp" data-wow-delay="0.3s">
                                    <div className="contact-left">
                                        <h3>Call Us</h3>
                                        <ul>
                                            <li>+01-123-456-7890</li>
                                            <li>+01-123-456-7890</li>
                                        </ul>
                                    </div>	
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-area1 style-1 m-r20 m-md-r0 wow fadeInUp" data-wow-delay="0.5s">
                                <ContactFormBlog />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-inner-2 pt-0">
                <div className="map-iframe map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970649679!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C+Rajasthan!5e0!3m2!1sen!2sin!4v1500819483219" 
                    style={{border:"0", width:"100%", minHeight:"100%", marginBottom: "-8px" }} allowFullScreen></iframe>
                </div>
            </div>
        </div>        
    );
};

export default ContactUs;