import Link from "next/link";
export default function CategoryMenuItem(){
    return(
        <ul className="nav navbar-nav">
            <li className="has-mega-menu cate-drop">
                <Link href="#">
                    <i className="icon feather icon-arrow-right"/>
                    <span>Clothes</span>
                    <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
                <div className="mega-menu">
                    <div className="row">
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"#"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems<span className="badge bg-primary">NEW</span></Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                                <li><Link href={"/shop-standard"}>Water Monitors</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                                <li><Link href={"/shop-standard"}>Water Monitors</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                                <li><Link href={"/shop-standard"}>Water Monitors<span className="badge bg-red">Offer</span></Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting<span className="badge bg-secondary">Exclusive</span></Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                                <li><Link href={"/shop-standard"}>Water Monitors</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting<span className="badge bg-orange">Feture</span></Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks<span className="badge bg-purple">SALE</span></Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                                <li><Link href={"/shop-standard"}>Home Entertainment Systems</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Smart Home Products</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                                <li><Link href={"/shop-standard"}>Lighting</Link></li>
                                <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                                <li><Link href={"/shop-standard"}>Locks</Link></li>
                                <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
            <li className="cate-drop">
                <Link href={"#"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>UrbanSkirt</span>
                    <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
                <ul className="sub-menu">
                    <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                    <li><Link href={"/shop-standard"}>Lighting</Link></li>
                    <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                    <li><Link href={"/shop-standard"}>Locks</Link></li>
                    <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                    <li><Link href={"/shop-standard"}>Entertainment Systems</Link></li>
                    <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                    <li><Link href={"/shop-standard"}>Appliances</Link></li>
                    <li><Link href={"/shop-standard"}>Water Monitors</Link></li>
                    <li><Link href={"/shop-standard"}>Gardening Systems</Link></li>
                </ul>
            </li>
            
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>VelvetGown</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>LushShorts</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Vintage</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Wedding </span>
                    <span className="badge bg-purple">SALE</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Cotton</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Linen</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Navy</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Urban</span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Business Meeting</span>
                </Link>
            </li>
            <li className="menu-items">
                <Link href={"#"}>
                    <i className="flaticon-blocks me-3"/>
                    <span>More</span>
                </Link>
            </li>
        </ul>
    )
}