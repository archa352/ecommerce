import { Dropdown } from "react-bootstrap";
import { dataItemValue } from "./SelectBoxOne";
import { useState } from "react";

export default function SelectBoxTwo(){
    const [dropValue2, setDropValue2] = useState("Products");
    return(
        <Dropdown className="select-dropdown">
            <Dropdown.Toggle className="dropdown-inner"><span className="me-1">{dropValue2}</span> <i className="fa-solid fa-angle-down ms-2" /></Dropdown.Toggle>
            <Dropdown.Menu>
                {dataItemValue.map((data, ind)=>(
                    <Dropdown.Item onClick={()=>setDropValue2(data.category)} eventKey={"List"} key={ind}>{data.category}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown> 
    )
}