"use client"
import { Fragment } from "react/jsx-runtime";
import IMAGES from "../../constant/theme";
import DzTextSlider from "../Home/DzTextSlider";
import ShopRollup from "./ShopRollup";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Link from "next/link";

export default function VideoSection(){
    const [openVideo, setOpenVideo] = useState(false);
    return(
        <Fragment>
            <div className="video-wrapper bg-parallax" style={{backgroundImage:`url('${IMAGES.BackBg2.src}')`}}>
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <Link href="#" className="icon-button popup-youtube" 
                            // href="https://www.youtube.com/watch?v=YwYoyQ1JdpQ"
                            onClick={()=>setOpenVideo(true)}
                        >
                            <div className="text-row word-rotate-box border-white c-black">                                
                                <ShopRollup />
                                <svg className="badge__emoji" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <g clipPath="url(#clip0_671_345)">
                                        <path d="M34.6779 15.3843L11.0529 0.821429C9.34369 -0.230839 7.2772 -0.274589 5.52493 0.704398C3.77266 1.68323 2.72656 3.46612 2.72656 5.47323V34.4664C2.72656 37.5013 5.17188 39.9835 8.17735 39.9999C8.18556 39.9999 8.19376 40 8.20181 40C9.14103 39.9999 10.1198 39.7056 11.0339 39.1478C11.7693 38.6991 12.0017 37.7392 11.5531 37.0039C11.1044 36.2685 10.1444 36.0361 9.40923 36.4848C8.98165 36.7456 8.56407 36.8805 8.19415 36.8804C7.06016 36.8742 5.84602 35.9028 5.84602 34.4665V5.47331C5.84602 4.6123 6.29477 3.84769 7.04634 3.42776C7.79798 3.00784 8.68431 3.02659 9.41658 3.47745L33.0417 18.0404C33.7518 18.4776 34.1581 19.2065 34.1564 20.0405C34.1547 20.8743 33.7454 21.6016 33.0314 22.0373L15.9503 32.4958C15.2156 32.9456 14.9847 33.9059 15.4346 34.6405C15.8843 35.3752 16.8446 35.6061 17.5792 35.1563L34.6583 24.6991C36.2935 23.7015 37.2721 21.9624 37.276 20.0467C37.2799 18.1312 36.3083 16.3881 34.6779 15.3843Z" fill="#FEEB9D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_671_345">
                                            <rect width="40" height="40" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="dz-features-wrapper overflow-hidden">
                <DzTextSlider/>
            </div>
            <Modal className="quick-view-modal" show={openVideo} onHide={()=>setOpenVideo(false)} centered>               
                <button type="button" className="btn-close" onClick={()=>setOpenVideo(false)}>
                    <i className="icon feather icon-x"/>
                </button>
                <div className="modal-body">
                    <video width="100%" height="100%" controls autoPlay>
                        <source src="/assets/images/video.mp4" type="video/mp4"/>
                    </video>                           
                </div>  
            </Modal>
        </Fragment>
    )
}