"use client"
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { Accordion } from "react-bootstrap";
import Image from 'next/image';


export default function ShopCheckout(){
    return(        
        <div className="page-content bg-light">
            <CommanBanner parentText="Home" mainText="Shop Checkout"  currentText="Shop Checkout" image={IMAGES.BackBg1.src} />
            <div className="content-inner-1">
                <div className="container">
                    <div className="row shop-checkout">
                        <div className="col-xl-8">
                            <h4 className="title m-b15">Billing details</h4>                           
                            <Accordion className="dz-accordion accordion-sm" id="accordionFaq" defaultActiveKey={"0"}>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header className="accordion-header" id="headingOne">                                        
                                        Returning customer? Click here to login
                                            <span className="toggle-close"></span>                                        
                                    </Accordion.Header>
                                    <Accordion.Body className="accordion-body">
                                        <p className="m-b0">If your order has not yet shipped, you can contact us to change your shipping address</p>
                                    </Accordion.Body>                                    
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header className="accordion-header" id="headingTwo">                                        
                                        Have a coupon? Click here to enter your code
                                        <span className="toggle-close"></span>                                        
                                    </Accordion.Header>                                   
                                    <Accordion.Body>
                                        <p className="m-b0">If your order has not yet shipped, you can contact us to change your shipping address</p>
                                    </Accordion.Body>
                                    
                                </Accordion.Item>
                            </Accordion>
                            <form className="row">
                                <div className="col-md-6">
                                    <div className="form-group m-b25">
                                        <label className="label-title">First Name</label>
                                        <input name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group m-b25">
                                        <label className="label-title">Last Name</label>
                                        <input name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group m-b25">
                                        <label className="label-title">Company name (optional)</label>
                                        <input name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="m-b25 value-select">
                                        <label className="label-title">Country / Region <span className='text-danger'>*</span></label>                                        
                                        <Form.Select aria-label="Default select example">
                                            <option defaultValue="India">Another option</option>
                                            <option value="1">India</option>
                                            <option value="2">UK</option>
                                            <option value="3">Iraq</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group m-b25">
                                        <label className="label-title">Street address <span className='text-danger'>*</span></label>
                                        <input name="dzName" required className="form-control m-b15" placeholder="House number and street name" />
                                        <input name="dzName" required className="form-control" placeholder="Apartment, suite, unit, etc. (optional)" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="m-b25 value-select">
                                        <label className="label-title">Town / City <span className='text-danger'>*</span></label>                                    
                                        <Form.Select aria-label="Default select example">
                                            <option defaultValue="Ajmer">Another option</option>
                                            <option value="1">Ajmer</option>
                                            <option value="2">Jaipur</option>
                                            <option value="3">Udaipur</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="m-b25 value-select">
                                        <label className="label-title">State <span className='text-danger'>*</span></label>                                       
                                        <Form.Select aria-label="Default select example">
                                            <option>Open this select menu</option>
                                            <option value="1">Rajasthan</option>
                                            <option value="2">Himachal</option>
                                            <option value="3">Chhattisgarh</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group m-b25">
                                        <label className="label-title">ZIP Code <span className='text-danger'>*</span></label>
                                        <input name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group m-b25">
                                        <label className="label-title">Phone <span className='text-danger'>*</span></label>
                                        <input type="number"   name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group m-b25">
                                        <label className="label-title">Email address <span className='text-danger'>*</span></label>
                                        <input name="dzName" required className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-12 m-b25">
                                    <div className="form-group m-b5">
                                    <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
                                            <label className="form-check-label" htmlFor="basic_checkbox_1">Create an account? </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="form-check-input" id="basic_checkbox_2" />
                                            <label className="form-check-label" htmlFor="basic_checkbox_2">Ship to a different address?</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 m-b25">
                                    <div className="form-group">
                                        <label className="label-title">Order notes (optional)</label>
                                        <textarea id="comments" placeholder="Notes about your order, e.g. special notes for delivery." className="form-control" name="comment" cols={90} rows={5} required></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-xl-4 side-bar">
                            <h4 className="title m-b15">Your Order</h4>
                            <div className="order-detail sticky-top">
                                <div className="cart-item style-1">
                                    <div className="dz-media">
                                        <Image src={IMAGES.ShopCardPic1} alt="/" />
                                    </div>
                                    <div className="dz-content">
                                        <h6 className="title mb-0">Sophisticated <br />Swagger Suit</h6>
                                        <span className="price">$40.00</span>
                                    </div>
                                </div>
                                <div className="cart-item style-1 mb-0">
                                    <div className="dz-media">
                                        <Image src={IMAGES.ShopCardPic2} alt="/" />
                                    </div>
                                    <div className="dz-content">
                                        <h6 className="title mb-0">Cozy Knit Cardigan Sweater</h6>
                                        <span className="price">$36.00</span>
                                    </div>
                                </div>
                                <table>
                                    <tbody>
                                        <tr className="subtotal">
                                            <td>Subtotal</td>
                                            <td className="price">$100</td>
                                        </tr>
                                        <tr className="title">
                                            <td><h6 className="title font-weight-500">Shipping</h6></td>
                                            <td></td>
                                        </tr>
                                        <tr className="shipping">
                                            <td>
                                                <div className="custom-control custom-checkbox">
                                                    <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                    <label className="form-check-label ms-1" htmlFor="flexRadioDefault1">
                                                        Free shipping
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-checkbox">
                                                    <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                    <label className="form-check-label ms-1" htmlFor="flexRadioDefault2">
                                                        Flat Rate:
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="price">25.75</td>
                                        </tr>
                                        <tr className="total">
                                            <td>Total</td>
                                            <td className="price">$125.75</td>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <div className="accordion dz-accordion accordion-sm" id="accordionFaq1">
                                    <div className="accordion-item">
                                        <div className="accordion-header" id="heading1">
                                            <div className="accordion-button collapsed custom-control custom-checkbox border-0" data-bs-toggle="collapse" data-bs-target="#collapse1" role="navigation"  aria-expanded="true" aria-controls="collapse1">
                                                <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                    Direct bank transfer
                                                </label>
                                            </div>
                                        </div>
                                        <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#accordionFaq1">
                                            <div className="accordion-body">
                                                <p className="m-b0">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <div className="accordion-header" id="heading2">
                                            <div className="accordion-button collapsed custom-control custom-checkbox border-0" data-bs-toggle="collapse" data-bs-target="#collapse2" role="navigation" aria-expanded="true" aria-controls="collapse2">
                                                <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault5" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault5">
                                                    Cash on delivery
                                                </label>
                                            </div>
                                        </div>
                                        <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="collapse2" data-bs-parent="#accordionFaq1">
                                            <div className="accordion-body">
                                                <p className="m-b0">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <div className="accordion-header" id="heading3">
                                            <div className="accordion-button collapsed custom-control custom-checkbox border-0" data-bs-toggle="collapse" data-bs-target="#collapse3" role="navigation" aria-expanded="true" aria-controls="collapse3">
                                                <input className="form-check-input radio" type="radio" name="flexRadioDefault" id="flexRadioDefault4" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                    Paypal
                                                </label>
                                                <Image src={IMAGES.ShopPayment} alt="/" />
                                                <Link href="#">What is PayPal?</Link>
                                            </div>
                                        </div>
                                        <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordionFaq1">
                                            <div className="accordion-body">
                                                <p className="m-b0">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="#">privacy policy.</Link></p>
                                <div className="form-group">
                                    <div className="custom-control custom-checkbox d-flex m-b15">
                                        <input type="checkbox" className="form-check-input" id="basic_checkbox_3" />
                                        <label className="form-check-label" htmlFor="basic_checkbox_3">I have read and agree to the website terms and conditions </label>
                                    </div>
                                </div>
                                <Link href="/shop-checkout" className="btn btn-secondary w-100">PLACE ORDER</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}