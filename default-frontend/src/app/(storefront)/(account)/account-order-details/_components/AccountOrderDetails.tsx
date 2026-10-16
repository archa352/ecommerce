"use client"
import Link from 'next/link';
import {Nav, Tab} from 'react-bootstrap'
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import Image from 'next/image';


export default function AccountOrderDetails() {
    return (
        <div className="page-content bg-light">
            <CommanBanner image={IMAGES.BackBg1.src} mainText="Order Details" parentText="Home" currentText="Order Details" />
            <div className="content-inner-1">
                <div className="container">
                    <div className="row">
                        <CommanSidebar />
                        <section className="col-xl-9 account-wrapper">
                            <div className="account-card order-details">
                                <div className="order-head">
                                    <div className="head-thumb">
                                        <Image src={IMAGES.ShopSmallPic1} alt="small_pic1" />
                                    </div>
                                    <div className="clearfix m-l20">
                                        <div className="badge">In Progress</div>
                                        <h4 className="mb-0">Order #17493</h4>
                                    </div>
                                </div>
                                <div className="row mb-sm-4 mb-2">
                                    <div className="col-sm-6">
                                        <div className="shiping-tracker-detail">
                                            <span>Item</span>
                                            <h6 className="title">casual shirt</h6>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="shiping-tracker-detail">
                                            <span>Courier</span>
                                            <h6 className="title">casual shirt</h6>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="shiping-tracker-detail">
                                            <span>Start Time</span>
                                            <h6 className="title">05 April 2024, 15:43:23</h6>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="shiping-tracker-detail">
                                            <span>Address</span>
                                            <h6 className="title">Address 451 Wall Street UK, London</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="content-btn m-b15">
                                    <Link href="/shop-wishlist" className="btn btn-secondary me-xl-3 me-2 m-b15 btnhover20">Export Details</Link>
                                    <Link href="/product-default" className="btn btn-outline-secondary m-b15 me-xl-3 me-2 btnhover20">Request Confirmation</Link>
                                    <Link href="/account-cancellation-requests" className="btn btn-outline-danger m-b15 btnhover20">Cancel Order</Link>
                                </div>
                                <div className="clearfix">
                                    <Tab.Container defaultActiveKey={'history'}>
                                        <div className="dz-tabs style-3">
                                            <Nav className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <Nav.Link className="nav-link" eventKey={"history"}>Order History</Nav.Link>
                                                <Nav.Link className="nav-link" eventKey={"details"}>Item Details</Nav.Link>
                                                <Nav.Link className="nav-link" eventKey={"Courier"}>Courier</Nav.Link>
                                                <Nav.Link className="nav-link" eventKey={"receiver"}>Receiver</Nav.Link>
                                            </Nav>
                                        </div>
                                        <Tab.Content className="tab-content" id="nav-tabContent">
                                            <Tab.Pane eventKey={"history"}>
                                                <div className="widget-timeline style-1">
                                                    <ul className="timeline">
                                                        <li>
                                                            <div className="timeline-badge success"></div>
                                                            <div className="timeline-box">
                                                                <Link href={"#"} className="timeline-panel">
                                                                    <h6 className="mb-0">Product Shiped</h6>
                                                                    <span>08/04/2025 5:23pm</span>
                                                                </Link>
                                                                <p><strong>Courier Service : </strong>UPS, R. Gosling</p>
                                                                <p><strong>Estimated Delivery Date : </strong>09/04/2025</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="timeline-badge primary"></div>
                                                            <div className="timeline-box">
                                                                <Link href={"#"} className="timeline-panel">
                                                                    <h6 className="mb-0">Product Shiped</h6>
                                                                    <span>08/04/2025 5:23pm</span>
                                                                </Link>
                                                                <p><strong>Tracking Number : </strong>3409-4216-8759</p>
                                                                <p><strong>Warehouse : </strong>Top Shirt 12b</p>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="timeline-badge"></div>
                                                            <div className="timeline-box">
                                                                <Link href={"#"} className="timeline-panel">
                                                                    <h6 className="mb-0">Product Packaging</h6>
                                                                    <span>09/04/2025 4:34pm</span>
                                                                </Link>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="timeline-badge"></div>
                                                            <div className="timeline-box">
                                                                <Link href={"#"} className="timeline-panel">
                                                                    <h6 className="mb-0">Order Palced</h6>
                                                                    <span>10/04/2025 2:36pm</span>
                                                                </Link>
                                                            </div>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"details"}> 
                                                <h5>Item Details</h5>
                                                <div className="tracking-item">
                                                    <div className="tracking-product"><Image src={IMAGES.ShopSmallPic1} alt="smil" /></div>
                                                    <div className="tracking-product-content">
                                                        <h6 className="title">Collar Casual Shirt</h6>
                                                        <small className="d-block"><strong>Price</strong> : $150</small>
                                                        <small className="d-block"><strong>Size</strong> : Xl</small>
                                                    </div>
                                                </div>
                                                <div className="tracking-item-content">
                                                    <span>Total Price</span>
                                                    <h6>+ $150</h6>
                                                </div>
                                                <div className="tracking-item-content border-bottom border-light mb-2">
                                                    <span className="text-success">Total Discounts</span>
                                                    <h6>- $55</h6>
                                                </div>
                                                <div className="tracking-item-content">
                                                    <span>Order Total</span>
                                                    <h6>$95</h6>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey={"Courier"}>
                                                <p>Commyolk Suspendisse et justo. Praesent mattis augue Aliquam ornare hendrerit augue Cras tellus In pulvinar lectus a est Curabitur eget orci Cras laoreet. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse et justo. Praesent mattis commyolk augue aliquam ornare.</p>
                                            </Tab.Pane>
                                            <Tab.Pane  eventKey={"receiver"}>
                                                <h5 className="text-success mb-4">Thank you Your order has been received</h5>
                                                <ul className="tracking-receiver">
                                                    <li>Order Number : <strong>#17493</strong></li>
                                                    <li>Date : <strong>17/04/2025, 02:34pm</strong></li>
                                                    <li>Total : <strong>$95</strong></li>
                                                    <li>Payment Methods : <strong>Cash on Delivery</strong></li>
                                                </ul>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}