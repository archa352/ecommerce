"use client"

import { useEffect, useState } from "react";

interface Timer {
    day: string;
    hour: string;
    min: string;
    sec: string;
}

export default function CountdownBlog(){
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
        <div className="countdown text-center">
            <div className="date">
                <span className="time days text-primary">{timer.day}</span>
                <span className="work-time">Days</span>
            </div>
            <div className="date">
                <span className="time hours text-primary">{timer.hour}</span>
                <span className="work-time">Hours</span>
            </div>
            <div className="date">
                <span className="time mins text-primary">{timer.min}</span>
                <span className="work-time">Minutess</span>
            </div>
            <div className="date">
                <span className="time secs text-primary">{timer.sec}</span>
                <span className="work-time">Second</span>
            </div>
        </div>
    )
}