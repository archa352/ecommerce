import Accordion from 'react-bootstrap/Accordion';
import Link from 'next/link';

const AboutAccordionData = [
    { headtext:'How can I contact customer support?'},
    { headtext:'Can I cancel my order?'},
    { headtext:'Do you offer international shipping?'},
    { headtext:'Can I track my order in real-time?'},
    { headtext:'How do I know if a product is in stock?'},
];

const AboutAccordionBlog = () => {
    return (
        <Accordion defaultActiveKey="0" className="dz-accordion accordion-sm m-b50">
            {AboutAccordionData.map((item, ind)=>(
                <Accordion.Item eventKey={`${ind}`} key={ind}>
                    <Accordion.Header   id="headingOne">
                        <Link href={"#"}>
                            {item.headtext}
                            <span className="toggle-close"></span>
                        </Link>
                    </Accordion.Header>
                    <Accordion.Body>                   
                        <p className="m-b0">If your order has not yet shipped, you can contact us to change your shipping address. If your order has already shipped, we may not be able to change the address.</p>
                    </Accordion.Body>
                </Accordion.Item>
            ))}            
        </Accordion>
    );
};

export default AboutAccordionBlog;