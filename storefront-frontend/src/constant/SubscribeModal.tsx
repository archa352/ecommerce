"use client"
import { useEffect, useRef, useState } from "react";
import IMAGES from "./theme";
import Image from "next/image";

export default function SubscribeModal(){
    const [subscribeModal, setSubscribeModal] = useState(false);    
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number>(0);
    function OpenModel() {                
        let time_stamp = 0
        let getvalue = localStorage.getItem('getval')
        if (getvalue == 'true') {
            const interval =  setInterval(() => {
                time_stamp += 1
                if (time_stamp > 28800) {
                    setSubscribeModal(true)
                    clearInterval(interval);
                }
            }, 1000)
            
        }
    }
    function handleClose(){
        localStorage.setItem('getval', 'true') 
        setSubscribeModal(false);
        document.body.classList.remove("overflow-hidden");
    }
    async function Modalduration() {       
         OpenModel();              
    }
    
    useEffect(() => {   
        const updateMargin = () => {             
            if (dialogRef.current) {
                const windowHeight = window.innerHeight;
                const modalHight =  dialogRef.current.clientHeight;
                setHeight(Math.max(0, (windowHeight - modalHight) / 2));                                               
            }
        }
        setInterval(() => {
            updateMargin();
        },1000)
        let getvalue = localStorage.getItem('getval')
        if(!getvalue){
            const timer = setTimeout(() => {
                setSubscribeModal(true);
                document.body.classList.add("overflow-hidden");
                clearTimeout(timer);          
            }, 5000);  
        }
        Modalduration();               
    }, [])
    return(
        <>
            <div className={`modal fade inquiry-modal style-1 ${subscribeModal ? "show d-block" : ""} `}        
                id="myModal" tabIndex={-1}  aria-labelledby="exampleModalCenterTitle" aria-hidden="true"
            >
                <div className="modal-dialog" role="document" id="modaldilog"  
                    ref={dialogRef} 
                    style={{ marginTop : height }}
                >
                    <div className="inquiry-adv">
                        <Image src={IMAGES.Adv2} alt="adv" />
                    </div>
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="myButton"                       
                            onClick={handleClose}
                        >
                            <span aria-hidden="true"><i className="icon feather icon-x" /></span>
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
                                        <input type="email" name="dzEmail" className="form-control" required placeholder="Enter Email Address" />
                                    </div>
                                    <button name="submit" type="submit" value="Submit" className="btn btn-secondary btn-block m-b15 text-uppercase">Subscribe</button>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" className="form-check-input" id="basic_checkbox_3" />
                                        <label className="form-check-label" htmlFor="basic_checkbox_3">I agree to receive marketing materials</label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {subscribeModal ? 
                <div className={`modal-backdrop fade show`}></div>
                : ''
            }
        </>
    )
}