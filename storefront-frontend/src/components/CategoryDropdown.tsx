"use client"
import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export default function Categorydropdown(){
    const [selectCat, setSelectCat] = useState("All Categories");
    return(
        <Dropdown className="bootstrap-select default-select">
            <Dropdown.Toggle as="div" className="btn dropdown-toggle btn-light show">
                {selectCat}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>setSelectCat("All Categories")}>All Categories</Dropdown.Item>
                <Dropdown.Item onClick={()=>setSelectCat("Clothes")}>Clothes</Dropdown.Item>
                <Dropdown.Item onClick={()=>setSelectCat("UrbanSkirt")}>UrbanSkirt</Dropdown.Item>
                <Dropdown.Item onClick={()=>setSelectCat("VelvetGown")}>VelvetGown</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("LushShorts")}>LushShorts</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Vintage")}>Vintage</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Wedding")}>Wedding</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Cotton")}>Cotton</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Linen")}>Linen</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Navy")}>Navy</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Urban")}>Urban</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Business Meeting")}>Business Meeting</Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Formal")}>Formal</Dropdown.Item>                        
            </Dropdown.Menu>
        </Dropdown> 
    )
}