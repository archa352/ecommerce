import IMAGES from "@/constant/theme";
import Image, { StaticImageData } from "next/image";

interface LocationDetailType {
    space: string;
    image : string | StaticImageData;
    title : string;
    second: string;
    address : string;
}

const LocationDetail : LocationDetailType[] = [
    {space:"p-0", image : IMAGES.CountryPic1, title:'United states',second:'0.1s', address: "4547 Irwin Manor, Apt. 953, 68488, South Arch, Florida, United States"},
    {space:"", image : IMAGES.CountryPic2, title:'India',second:'0.2s', address: "230 Ron Trail, Apt. 242, 0162, Pretoria, Rajasthan, India"},
    {space:"", image : IMAGES.CountryPic3, title:'South Africa',second:'0.3s', address: "05876 Tyrone Spurs, Durban, KwaZulu-Natal, South Africa"},
];

const ContactUs3 = () =>{
    return(
        <div className="page-content bg-light">
            <div className="dz-bnr-inr">
                <div className="container">
                    <div className="text-start contact-heading dz-bnr-inr-entry wow fadeInUp" data-wow-delay="0.1s">
                        <h2>Need Assistance with Your Account? Reach Out to Our Support Team</h2>
                    </div>	
                </div>
                <div className="dz-text wow fadeInUp" data-wow-delay="0.2s">Contact Us</div>
            </div>
            <div className="content-inner-2 pt-0 wow fadeInUp" data-wow-delay="0.3s">
                <div className="map-iframe map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970649679!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C+Rajasthan!5e0!3m2!1sen!2sin!4v1500819483219" style={{border:"0", width:"100%", minHeight:"100%", marginBottom: "-8px"}} allowFullScreen></iframe>
                </div>
            </div>
        
            <section className="content-inner">
                <div className="container">
                    <div className="section-head">
                        <h3 className="title">Our Locations</h3>
                    </div>
                    <div className="row justify-content-center">
                        {LocationDetail.map((elem, index)=>(
                            <div className="col-lg-4 col-md-6 col-sm-12 locations-box wow fadeInUp m-b30" data-wow-delay={elem.second} key={index}>
                                <div className={`locations-box-inner ${elem.space}`}>
                                    <div className="country-media">
                                        <Image src={elem.image} alt="elem" />
                                        <h6 className="title">{elem.title}</h6>
                                    </div>				
                                    <div className="dz-content">
                                        <h4 className="title">{elem.address}</h4>
                                        <div className="contact-info">
                                            <div className="contact-left">
                                                <h4>Call Us</h4>
                                                <ul>
                                                    <li>+01-123-456-7890</li>
                                                    <li>+01-123-456-7890</li>
                                                </ul>
                                            </div>
                                            <div className="contact-right">
                                                <h4>Email Us</h4>
                                                <ul>
                                                    <li>help@Pixio.com</li>
                                                </ul>
                                            </div>	
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}                       
                    </div>	
                </div>
            </section>
        </div>
    )
}
export default ContactUs3;