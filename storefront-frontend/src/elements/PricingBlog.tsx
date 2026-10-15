import React, { Fragment } from 'react';
import Link from 'next/link';

const pricingTableData = [
    {plane:'Starter Plan', price:'19', duration:'Week', features: 'starter'},
    {plane:'Popular Plan', price:'39', duration:'Month', features: 'pro'},
    {plane:'Custom Plan', price:'69', duration:'Year', features: 'enterprise'},
]

const PricingBlog = () => {
    return (
        <Fragment>
            {pricingTableData.map((data, ind)=>(
                <div className="col-lg-4 col-md-6 wow fadeInUp"  data-wow-delay={`${(ind + 1) * 0.1}s`} key={ind}>
                    <div className="pricingtable-wrapper style-1 bg-light m-b30">
                        <div className="pricingtable-inner">
                            <div className="pricingtable-title">
                                <h3 className="title">{data.plane}</h3>
                                <p className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                            </div>
                            <div className="pricingtable-price"> 
                                <h2 className="pricingtable-bx">${data.price}<small className="pricingtable-type">/{data.duration}</small></h2>
                            </div>
                            <div className="pricingtable-button"> 
                                <Link href="/shop-registration" className="btn btn-outline-secondary">Try for free</Link> 
                            </div>
                            <div className="pricingtable-list">
                                <h4 className="list-title">Key Features:</h4>
                                {data.features === "starter" &&
                                    <ul className="pricingtable-features">
                                        <li>Access to all features</li>
                                        <li>Assisted onboarding support</li>
                                        <li>CPM Overage: Unlimited</li>
                                        <li className="disable">Program reviews 1x a month</li>
                                        <li className="disable">CPM Overage: Unlimited</li>
                                        <li className="disable">Assisted onboarding support</li>
                                        <li className="disable">CPM Overage: Unlimited</li>
                                    </ul>
                                }
                                {data.features === "pro" &&
                                    <ul className="pricingtable-features">
                                        <li>Access to all features</li>
                                        <li>Assisted onboarding support</li>
                                        <li>CPM Overage: Unlimited</li>
                                        <li>Program reviews 1x a month</li>
                                        <li>CPM Overage: Unlimited</li>
                                        <li className="disable">Assisted onboarding support</li>
                                        <li className="disable">CPM Overage: Unlimited</li>
                                    </ul>
                                }
                                {data.features === "enterprise" &&
                                    <ul className="pricingtable-features">
                                        <li>Access to all features</li>
                                        <li>Assisted onboarding support</li>
                                        <li>CPM Overage: Unlimited</li>
                                        <li>Program reviews 1x a month</li>
                                        <li>CPM Overage: Unlimited</li>
                                        <li>Assisted onboarding support</li>
                                        <li>CPM Overage: Unlimited</li>
                                    </ul>
                                }
                            </div>	
                        </div>
                    </div>
                </div>
            ))} 
        </Fragment>
    );
};

export default PricingBlog;