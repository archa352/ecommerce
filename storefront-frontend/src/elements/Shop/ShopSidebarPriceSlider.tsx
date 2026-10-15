"use client"

import { useState } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";




export default function ShopSidebarPriceSlider(){
    const [priceValue , setPriceValue] = useState({min : 40, max : 350});

    function handleChangeVale(eve : number[]){
        setPriceValue({min: eve[0], max : eve[1]})
    }

    return(
        <div className="range-slider style-1">
            <div id="slider-tooltips2" className="mb-3">
                <Nouislider range={{ min: 0, max: 400 }} start={[priceValue.min, priceValue.max]} connect 
                    format={{
                        to: (value: number) => `$${value.toFixed(0)}`, 
                        from: (value: string) => parseFloat(value.replace('$', ''))
                    }}
                    onChange={handleChangeVale}
                />   
            </div>            
            <span className="example-val" id="slider-margin-value-min2">Min Price: {priceValue.min}</span>
            <span className="example-val" id="slider-margin-value-max2">Max Price: {priceValue.max}</span>
        </div>
    )
} 