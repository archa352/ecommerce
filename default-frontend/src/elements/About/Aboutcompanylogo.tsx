import React from 'react';
import { Aboutcompanylogodata } from '../../constant/Alldata';
import Link from 'next/link';
import Image from 'next/image';

const Aboutcompanylogo = () => {    
    return (
        <React.Fragment>
            {Aboutcompanylogodata.map((data, ind)=>(
                <div className="col-md-3 col-sm-4 col-6 p-lg-b30 p-b20  wow fadeInUp" data-wow-delay={`${(ind + 1) * 0.1}s`} key={ind}>
                    <Link href={"#"} className="companies-wrapper">
                        <div className="companies-media">
                            <Image src={data.image} alt="media" /> 
                        </div>
                    </Link>
                </div>
            ))} 
        </React.Fragment>
    );
};

export default Aboutcompanylogo;