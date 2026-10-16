import { Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { CategoryData, colorData, TagData, widgetSize } from "../../constant/Alldata";
import ShopSidebarPriceSlider from "./ShopSidebarPriceSlider";

export default function ShopSidebar(){
    return(
        <Fragment>           
            <div className="widget widget_search">
                <div className="form-group">
                    <div className="input-group">
                        <input name="dzSearch" required type="search" className="form-control" placeholder="Search Product" />
                        <div className="input-group-addon">
                            <button name="submit" value="Submit" type="submit" className="btn">                                
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#0D775E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M17.5 17.5L13.875 13.875" stroke="#0D775E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget">
                <h6 className="widget-title">Price</h6>
                <div className="price-slide range-slider">
                    <div className="price">
                        <ShopSidebarPriceSlider />
                    </div>
                </div>
            </div>
            <div className="widget">
                <h6 className="widget-title">Color</h6>
                <div className="d-flex align-items-center flex-wrap color-filter ps-2">
                    {colorData.map((item, ind)=>(
                        <div className="form-check" key={ind}>
                            <input className="form-check-input" type="radio" name="radioNoLabel" id={item.inputid} value={item.valuecolor}  defaultChecked/>
                            <span style={{backgroundColor : item.valuecolor}}></span>
                        </div>
                    ))}                    
                </div>
            </div>
            
            <div className="widget">
                <h6 className="widget-title">Size</h6>
                <div className="btn-group product-size">
                    {widgetSize.map((item, ind)=>(
                        <Fragment key={ind}>
                            <input type="radio" className="btn-check" name="btnradio1" id={item.inputid} defaultChecked  />
                            <label className="btn" htmlFor={item.inputid}>{item.number}</label>
                        </Fragment>
                    ))}                    
                </div>
            </div>
            
            <div className="widget widget_categories">
                <h6 className="widget-title">Category</h6>
                <ul>
                    {CategoryData.map((elem, i)=>(
                        <li className="cat-item cat-item-26" key={i}><Link href="/blog-category">{elem.name}</Link> ({elem.number})</li>
                    ))}                    
                </ul>
            </div>
            
            <div className="widget widget_tag_cloud">
                <h6 className="widget-title">Tags</h6>
                <div className="tagcloud"> 
                    {TagData.map((item, ind)=>(
                        <Link href="/blog-tag" key={ind}>{item.tagname}</Link>
                    ))}                                                
                </div>
            </div>            
        </Fragment>
    )
}