import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { BlogGridData, CategoryData, TagData, widgetBox } from "@/constant/Alldata";
import Image from "next/image";


export default function BlogGridBothSidebar(){
    return(
        <>
            <div className="page-content bg-light">
                <CommanBanner mainText="Blog Grid Both Sidebar" parentText="Home" currentText="Blog Grid Both Sidebar" image={IMAGES.BackBg1.src} />
                <section className="content-inner-1 z-index-unset">
                    <div className="container-fluid">
                        <div className="row">                        
                            <div className="col-xl-3 col-lg-5 col-md-12 m-b30 order-lg-1 order-sm-2 order-2">
                                <aside className="side-bar left sticky-top mt-lg-0 mt-md-5">
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
                                                                <li className="post-date"> {data.date}</li>
                                                            </ul>
                                                        </div>
                                                        <h6 className="title"><Link href="/post-standard">{data.title}</Link></h6>
                                                    </div>
                                                </div>
                                            ))}    
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
                                </aside>
                            </div>			
                            <div className="col-xl-6 col-lg-7 col-md-12 m-b30 order-lg-2 order-sm-1">                            
                                <div className="row">
                                    {BlogGridData.map((elem, ind)=>(
                                        <div className="col-lg-6 col-md-6 col-sm-6 m-b30 wow fadeInUp" data-wow-delay={elem.dealy} key={ind}>
                                            <div className="dz-card style-5">
                                                <div className="dz-media">
                                                    <Image src={elem.image} alt="/" />
                                                </div>
                                                <div className="dz-info">
                                                    <div className="dz-meta">
                                                        <ul>
                                                            <li className="post-date">{elem.date}</li>                                                    
                                                        </ul>
                                                    </div>
                                                    <h4 className="dz-title">
                                                        <Link className="text-white" href="/post-left-sidebar">{elem.text}</Link>
                                                    </h4>
                                                    <Link href="/post-left-sidebar" className="font-14 mt-auto read-btn">Read More 
                                                        <i className="icon feather icon-chevron-right"/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}                               
                                    <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.7s">
                                        <Link href="/blog-dark-half-image" className="btn btn-secondary">
                                            Load More
                                        </Link>
                                    </div>
                                </div>
                            </div>	
                            <div className="col-xl-3 col-lg-12 col-md-12 m-b30 order-lg-3 order-sm-2">
                                <aside className="side-bar sticky-top mt-lg-0 mt-md-5">
                                    <div className="widget">
                                        <h5 className="widget-title">Search</h5>
                                        <div className="search-bx">
                                            <form role="search" method="post">
                                                <div className="input-group">
                                                    <input name="text" className="form-control" placeholder="Search" type="text" />
                                                    <span className="input-group-btn">
                                                            <button className="btn">
                                                            <i className="icon feather icon-search"/>
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
                                    
                                    <div className="widget widget_tag_cloud">
                                        <h5 className="widget-title">Tags</h5>
                                        <div className="tagcloud"> 
                                            {TagData.map((item, ind)=>(
                                                <Link href="/blog-tag" key={ind}>{item.tagname}</Link>
                                            ))} 
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}