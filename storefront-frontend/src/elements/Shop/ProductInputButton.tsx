import { useState } from "react"

export default function ProductInputButton(){    
    const [inputValue, setInputValue] = useState<number>(1);
    function handleIncrease() {
        setInputValue(prev => prev + 1);
    }
    function handleDecrease() {
        setInputValue(prev => (prev > 1 ? prev - 1 : prev));
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue > 0) {
            setInputValue(newValue);
        }
    }
    return(
        <div className="input-group bootstrap-touchspin gird-media">
            <span className="input-group-addon bootstrap-touchspin-prefix " style={{display: "none"}}></span>
            <input type="text" value={inputValue} name="demo_vertical2" className="form-control" style={{display: "block"}} 
                onChange={handleChange}
            />
            <span className="input-group-addon bootstrap-touchspin-postfix" style={{display: "none"}}></span>
            <span className="input-group-btn-vertical mobile-quantity">
                <button className="btn btn-default bootstrap-touchspin-up" type="button"
                    onClick={handleIncrease}
                >
                    <i className="fa-solid fa-plus"/>
                </button>
                <button className="btn btn-default bootstrap-touchspin-down" type="button"
                    onClick={handleDecrease}
                >
                    <i className="fa-solid fa-minus"/>
                </button>
            </span>
        </div>
    )
}