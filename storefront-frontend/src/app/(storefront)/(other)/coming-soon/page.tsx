"use client"
import Link from "next/link";
import IMAGES from "@/constant/theme";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Timer {
    day: string;
    hour: string;
    min: string;
    sec: string;
}
export default function ComingSoon(){
      let year = new Date().getFullYear();
        const [timer, setTimer] = useState<Timer>({
            day: '00',
            hour: '00',
            min: '00',
            sec: '00',
        });
        useEffect(() => {
            let countDownDate = new Date(`Jan 5, ${year} 15:37:25`).getTime();    
            const interval = setInterval(() => {
              const now = new Date().getTime();
              const distance = countDownDate - now;    
              setTimer({
                day: Math.floor(distance / (1000 * 60 * 60 * 24))
                  .toString()
                  .padStart(2, '0'),
                hour: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                  .toString()
                  .padStart(2, '0'),
                min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                  .toString()
                  .padStart(2, '0'),
                sec: Math.floor((distance % (1000 * 60)) / 1000)
                  .toString()
                  .padStart(2, '0'),
              });
        
              if (distance < 0) {
                countDownDate = new Date("Jan 5, 2026 15:37:25").getTime();
              }
            }, 1000);    
            return () => clearInterval(interval); 
        }, []);
    return(
        <div className="page-wraper">
            <section className="px-3 overflow-hidden bg-light">
                <div className="row dz-coming-soon">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 px-0">
                        <div className="dz-coming-bx single-page">
                            <div className="logo">
                                <Link href="/"><Image src={IMAGES.logopng} alt="logo" /></Link>
                            </div>
                            <div className="dz-content">
                                <h2 className="dz-title pe-xl-4">Our awesome new site is almost ready to launch!</h2>
                                <p>In the meantime, sign up for our monthly Newsletter to stay up yo date.</p>
                                
                                <form className="dzSubscribe" action="script/mailchamp.php" method="post">
                                    <div className="dzSubscribeMsg"></div>
                                    <div className="ft-row m-b15 d-flex align-items-center">
                                        <input name="dzEmail" required type="email" placeholder="Your Email Address" className="form-control bg-light" />
                                        <button name="submit" value="Submit" type="submit" className="btn btn-secondary">Subscribe</button>
                                    </div>
                                </form>
                            </div>	
                            <div className="countdown-row">
                                <div className="countdown">
                                    <div className="date">
                                        <span className="time" id="day">{timer.day}</span>
                                        <span className="text"> Days</span>
                                    </div>
                                    <div className="date">
                                        <span className="time" id="hour">{timer.hour}</span>
                                        <span className="text">Hours</span>
                                    </div>
                                    <div className="date">
                                        <span className="time" id="min">{timer.min}</span>
                                        <span className="text">Minutes</span>
                                    </div>
                                    <div className="date">
                                        <div className="time lost" id="second">{timer.sec}</div>
                                        <span className="text">Seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Image src={IMAGES.CircleLine1} className="bg-img" alt="line" />
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 px-0  d-lg-block d-none">
                        <div className="dz-coming-bx2">
                            <Image src={IMAGES.CircleLine2} className="bg-img2" alt="circle" />
                            <div className="dz-coming-media">
                                <Image src={IMAGES.LadyPng} alt="lady" />   
                            </div>	
                        </div>
                        <div className="banner-social-media style-1">
                            <ul>
                                <li>
                                    <Link  target="_blank" href="https://www.instagram.com/dexignzone/">Instagram</Link>
                                </li>
                                <li>
                                    <Link  target="_blank" href="https://www.facebook.com/dexignzone">Facebook</Link>
                                </li>
                                <li>
                                    <Link  target="_blank" href="https://twitter.com/dexignzones">twitter</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}