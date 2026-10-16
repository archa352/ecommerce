import React from 'react';
import IMAGES from '../../constant/theme';
import Link from 'next/link';
import Image from 'next/image';

const collectionImgData = [
    { image:IMAGES.CollectionPng1, design:'collection1'},
    { image:IMAGES.CollectionPng2, design:'collection2'},
    { image:IMAGES.CollectionPng3, design:'collection3'},
    { image:IMAGES.CollectionPng4, design:'collection4'},
    { image:IMAGES.CollectionPng5, design:'collection5'},
]

const CollectionBlog = () => {
    return (
        <React.Fragment>
            <div className="container">
                <h2 className="title wow fadeInUp" data-wow-delay="0.2s">Upgrade your style with our  top-notch collection.</h2>
                <div className="text-center">	
                    <Link href="/shop-list" className="btn btn-secondary btn-lg wow fadeInUp m-b30" data-wow-delay="0.4s">All Collections</Link>
                </div>	
            </div>
            {collectionImgData.map(({image, design}, ind)=>(
                <div className={design} key={ind}><Image src={image} alt="ind" /></div>
            ))}
            
        </React.Fragment>
    );
};

export default CollectionBlog;