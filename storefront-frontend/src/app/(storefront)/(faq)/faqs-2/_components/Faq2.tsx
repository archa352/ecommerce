"use client"
import {Accordion, Tab, Nav} from 'react-bootstrap';
import IMAGES from '@/constant/theme';
import Link from 'next/link';
import Image from 'next/image';

const headDataTitle = [
    { name:'General', keytitle:'General', icon:'icon-box'},
    { name:'Returns', keytitle:'Returns', icon:'icon-shopping-cart'},
    { name:'Gift', keytitle:'Gift', icon:'icon-gift'},
    { name:'Refunds', keytitle:'Refunds', icon:'icon-dollar-sign'},
    { name:'Payments', keytitle:'Payments', icon:'icon-credit-card'},
    { name:'Shipping', keytitle:'Shipping', icon:'icon-truck'},
]

const AboutAccordionData = [
    { headtext:'How can I contact customer support?'},
    { headtext:'Can I cancel my order?'},
    { headtext:'Do you offer international shipping?'},
    { headtext:'Can I track my order in real-time?'},
    { headtext:'How do I know if a product is in stock?'},
    { headtext:'Can I place an order over the phone?'},
];

function AccordBlog() {
    return(
        <Accordion className=" dz-accordion accordion-sm"  defaultActiveKey="0">
            {AboutAccordionData.map((item, ind)=>(
                <Accordion.Item eventKey={`${ind}`} key={ind}>
                    <Accordion.Header   id="headingOne">
                        <Link href={"#"}>{item.headtext}<span className="toggle-close"></span></Link>
                    </Accordion.Header>
                    <Accordion.Body>                   
                        <p className="m-b0">If your order has not yet shipped, you can contact us to change your shipping address. If your order has already shipped, we may not be able to change the address.</p>
                    </Accordion.Body>
                </Accordion.Item>
            ))} 
        </Accordion>  
    )
}

const Faq2 = () => {
    return (
        <div className="page-content bg-light">		
            <section className="px-3">
                <div className="row">
                    <Tab.Container defaultActiveKey={'General'}>
                        <div className="col-xl-6 col-lg-6 col-md-12 faq-side-content">
                            <div className="dz-bnr-inr-entry" >
                                <h1>Have any questions? </h1>
                                <nav aria-label="breadcrumb text-align-start" className="breadcrumb-row mb-lg-4 mb-3">
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                        <li className="breadcrumb-item">Faq’s 2</li>
                                    </ul>
                                </nav>	
                            </div>
                            <div className="dz-tabs style-1 tab-space">
                                <Nav as="ul" className="nav nav-tabs">
                                    {headDataTitle.map(({name, keytitle, icon}, ind)=>(
                                        <Nav.Link as="li" className=""  eventKey={keytitle} key={ind}>
                                            <i className={`icon feather ${icon}`} />
                                            <span>{name}</span>
                                        </Nav.Link>
                                    ))}
                                </Nav>
                            </div>
                            <div className="dz-media d-none d-lg-block d-xl-block rounded"> 
                                <Image className="media" src={IMAGES.FaqPic1} alt="" />
                            </div>
                        </div>
                        
                        <div className="col-xl-6 col-lg-6 col-md-12 faq-end-content">
                            <div className="faq-head">
                                <div className="search_widget">
                                    <form className="dzSearch">
                                        <div className="form-group">
                                            <div className="input-group mb-0">
                                                <input name="dzSearch" type="search" className="form-control" placeholder="Search FAQ" />
                                                <div className="input-group-addon">
                                                    <button name="dzSearch" value="search" className="btn">
                                                        <i className="icon feather icon-search" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <Tab.Content>                            
                                <Tab.Pane eventKey={`General`}>
                                    <AccordBlog />                        
                                </Tab.Pane>
                                <Tab.Pane eventKey={`Returns`}>
                                    <AccordBlog />                                  
                                </Tab.Pane>
                                <Tab.Pane eventKey={`Gift`}>
                                    <AccordBlog />                                  
                                </Tab.Pane>
                                <Tab.Pane eventKey={`Refunds`}>
                                    <AccordBlog />                                
                                </Tab.Pane>
                                <Tab.Pane eventKey={`Payments`}>
                                   <AccordBlog />                                  
                                </Tab.Pane>
                                <Tab.Pane eventKey={`Shipping`}>
                                    <AccordBlog />                                  
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
                
            </section>

        </div>
    );
};

export default Faq2;