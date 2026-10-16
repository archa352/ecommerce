import Link from "next/link";

import IMAGES from "../../constant/theme";
import TeamImageCard from "./TeamImageCard";

const allteamDataItem = [
    { image: IMAGES.Teampic1, name:'John Doe', post:'CEO & Founder'},
    { image: IMAGES.Teampic2, name:'Ivan Mathews', post:'iOS Developer'},
    { image: IMAGES.Teampic3, name:'Macauley Herring', post:'Customer Success'},
    { image: IMAGES.Teampic4, name:'Alya Levine', post:'CTO'},
    { image: IMAGES.Teampic5, name:'Rose Hernandez', post:'Backend Developer'},
    { image: IMAGES.Teampic6, name:'Elen Benitez', post:'Designer'},
];

const TeamCreators = () => {
    return (        
        <div className="row g-3 g-xl-4">
            <div className="col-xl-6 col-lg-8 col-md-12 col-sm-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="section-head ">
                    <h2 className="title">Meet our team of creators, designers, and world-class problem solvers</h2>
                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.</p>
                    <Link className="btn btn-secondary me-3" href="/shop-registration">Join Our Team</Link>
                </div>
            </div>            
            {allteamDataItem.map((item, ind)=>(
                <div className="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-6" key={ind} >
                    <TeamImageCard image={item.image} name={item.name} post={item.post} />
                </div>
            ))}            
        </div>			
    );
};

export default TeamCreators;