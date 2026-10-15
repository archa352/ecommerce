import Link from "next/link";

const faqContentData = [
    {time:0.8, title:'How can I contact customer support?', para:'If your order has not yet shipped, you can contact us to change your shipping address. If your order has already shipped, we may not be able to change the address.'},
    {time:1, title:'How can I track my order?', para:"Once your order has shipped, you will receive a tracking number via email. You can use this tracking number to track your order on our website or on the carrier's website."},
    {time:1.2, title:'Can I cancel my order?', para:'If your order has not yet shipped, you can cancel it by contacting us. If your order has already shipped, you will need to follow our return policy.'},
    {time:1.4, title:'Do you offer gift wrapping?', para:'Yes, we offer gift wrapping for an additional fee. You can select this option during checkout.'},
    {time:1.6, title:'Do you offer international shipping?', para:'Yes, we offer international shipping to select countries. Please check our shipping page for more information.'},
    {time:1.8, title:'What is your return policy?', para:'We offer a 30-day return policy for most products. If you are not satisfied with your purchase, please contact us for instructions on how to return the item.'},
]

const Faq1 = () => {
    return (
        <div className="page-content bg-light">
            <section className="content-inner main-faq-content">
                <div className="container">
                    <div className="row faq-head">
                        <div className="col-12 text-center">
                            <h1 className="title">Hi! How can we help you?</h1>
                            <nav className="breadcrumb-row">
                                <ul className="breadcrumb mb-lg-4 mb-3">
                                    <li className="breadcrumb-item"><Link href="/"> Home</Link></li>
                                    <li className="breadcrumb-item">Faq’s 1</li>
                                </ul>
                            </nav>
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
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {faqContentData.map((data, ind)=>(
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 m-b30 m-sm-b15" key={ind}>
                                <div className="faq-content-box style-1">
                                    <div>
                                        <h3 className="dz-title">{data.title}</h3>
                                        <p>{data.para}</p>
                                    </div>
                                    <Link href="/faqs-2" className="faq-link">
                                        <i className="flaticon-plus" />
                                        Show More
                                    </Link>
                                </div>
                            </div>
                        ))}                        
                    </div>
                </div>
            </section>
            
        </div>
    );
};

export default Faq1;