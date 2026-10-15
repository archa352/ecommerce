import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import { CategoryData, TagData, widgetBox } from "../../constant/Alldata";
import Image from "next/image";



export default function BlogSidebar(){
    return(
        <Fragment>
            <div className="widget">
                <h5 className="widget-title">Search</h5>
                <div className="search-bx">
                    <form role="search" method="post">
                        <div className="input-group">
                            <input name="text" className="form-control text-hide" placeholder="Search" type="text" />
                            <span className="input-group-btn">
                                    <button className="btn">
                                    <i className="icon feather icon-search"></i>
                                </button>
                            </span> 
                        </div>
                    </form>
                </div>
            </div>
            <div className="widget widget_categories style-1">
                <h5 className="widget-title">Category</h5>
                <ul>
                    {CategoryData.map((elem, i)=>(
                      <li className="cat-item" key={i}><Link href="/blog-category">{elem.name}</Link> ({elem.number})</li>
                    ))}                    
                </ul>
            </div>
            <div className="widget recent-posts-entry">
                <h5 className="widget-title">Latest Post</h5>
                <div className="widget-post-bx">
                    {widgetBox.map((data, ind)=>(
                        <div className="widget-post clearfix" key={ind}>
                            <div className="dz-media"> 
                                <Link href="/post-standard"><Image src={data.image} alt="/" /></Link>
                            </div>
                            <div className="dz-info">
                                <div className="dz-meta">
                                    <ul>
                                        <li className="post-date"> {data.date} </li>
                                    </ul>
                                </div>
                                <h6 className="title"><Link href="/post-standard">{data.title}</Link></h6>
                            </div>
                        </div>
                    ))}                    
                </div>
            </div>
            <div className="widget widget_tag_cloud">
                <h5 className="widget-title">Tags</h5>
                <div className="tagcloud"> 
                    {TagData.map((item, ind)=>(
                        <Link href="/blog-tag" key={ind}>{item.tagname}</Link>
                    ))}                    
                </div>
            </div>
        </Fragment>
    )
}