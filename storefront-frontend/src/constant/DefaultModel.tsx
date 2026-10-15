import { Modal } from "react-bootstrap";
import IMAGES from "./theme";
import { useState } from "react";
import Image from "next/image";

export default function DefaultModel(){
    const [demoModal, setDemoModal] = useState(true); 
    return(
        <Modal className="inquiry-modal style-1" id="myModal" show={demoModal}>                
            <div className="inquiry-adv">
                <Image src={IMAGES.Adv2} alt="adv"/>
            </div>
            <div className="modal-content">
                <button type="button" className="btn-close" 
                    onClick={()=>setDemoModal(false)}
                >
                    <span aria-hidden="true">
                        <i className="icon feather icon-x" />
                    </span>
                </button>
                <div>
                    <div className="modal-header">
                        <span className="title-head">Newsletter</span>
                        <h3 className="modal-title" id="exampleModalLongTitle">Subscribe Now</h3>
                        <p className="text">Stay updated on all that's new add noteworthy</p>
                    </div>
                    <div className="modal-body">
                        <form className="dzSubscribe">
                            <div className="dzSubscribeMsg"></div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="dzEmail" className="form-control" required placeholder="Enter Email Address"/>
                            </div>
                            <button name="submit" type="submit" value="Submit" className="btn btn-secondary btn-block m-b15 text-uppercase">Subscribe</button>
                            <div className="custom-checkbox">
                                <input type="checkbox" className="form-check-input" id="basic_checkbox_3"/>
                                <label className="form-check-label" htmlFor="basic_checkbox_3">I agree to receive marketing materials</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        
    </Modal>
    )
}