import Link from "next/link";
import IMAGES from "../constant/theme";
import CountdownBlog from "./CountdownBlog";
import { Fragment, useReducer } from "react";
import { accountMenuItem, menuData2, menuData3, menuData4, menuDataOne, portfolioMenu } from "../constant/Alldata";
import Image from "next/image";

// Pages Menu Items
// interface MenuItem4 {
//     title: string;
//     links: { name: string; path: string }[];
//     subMenu?: MenuItem4[]; 
// }


// interface stateType{
//     home : boolean; 
//     collpase0 : boolean; 

// }

// const initialState = {
//     home : false,
//     collpase0 : false,

// };
// const reducer = (state : stateType, action : reduType) =>{
//     switch (action.type){
//         case 'home':
//             return { ...state, home: !state.home }

//         default:
//             return state	
//     }	
// }

interface reduType{
    type : string;        
    index : number;
}

interface stateType {
    home: boolean;
    openMenu: number | null; 
}

const initialState = {
    home: false,
    openMenu: null,
};

const reducer = (state: stateType, action: reduType) => {
    switch (action.type) {
        case 'home':
            return { ...state, home: !state.home };
        case 'toggleMenu':            
            return {
                ...state,
                openMenu: state.openMenu === action.index ? null : action.index,
            };
        default:
            return state;
    }
};
export default function Menus(){    
    const [state, dispatch] = useReducer(reducer, initialState);
       
    return(
        <ul className="nav navbar-nav">
            <li className={`has-mega-menu sub-menu-down auto-width menu-left ${state.openMenu === 0 ? 'open' : ''}`}                
                onClick={() => dispatch({ type: 'toggleMenu', index: 0 })}
            >
                <Link href="#"><span>Home</span></Link>
                <div className="mega-menu ">
                    <ul className="demo-menu mb-0">
                        <li>
                            <Link href="/">
                                <Image src={IMAGES.demo1} alt="/" />
                                <span className="menu-title">01 Home Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/index-2">
                                <Image src={IMAGES.demo2} alt="/" />
                                <span className="menu-title">02 Home Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/index-3">
                                <Image src={IMAGES.demo3} alt="/" />
                                <span className="menu-title">03 Home Page</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 1 ? 'open' : ''}`}                
                onClick={() => dispatch({ type: 'toggleMenu', index: 1 })}
            >
                <Link href="#"><span>Shop</span><i className="fas fa-chevron-down tabindex" /></Link>                      
                <div className="mega-menu shop-menu">
                    <ul>
                        <li className="side-left">
                            <ul>
                                {menuDataOne.map((menu, index) => (
                                    <li key={index}>
                                        <Link href="#" className="menu-title">{menu.title}</Link>
                                        <ul>
                                            {menu.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <Link href={link.path}>{link.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}                                
                                <li className="month-deal">
                                    <div className="clearfix me-3">
                                        <h3>Deal of the month</h3>
                                        <p className="mb-0">Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on Pixio <Link href="/shop-standard" className="dz-link-2">View All Products</Link></p>
                                    </div>
                                    <div className="sale-countdown">
                                        <CountdownBlog />
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="side-right">
                            <div className="adv-media">
                                <Image src={IMAGES.Adv1} alt="/" />
                            </div>
                        </li>
                    </ul>
                </div>     
            </li>
            <li className={`has-mega-menu sub-menu-down auto-width ${state.openMenu === 2 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 2 })}
            >
                <Link href="#"><span>Blog</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu">
                    <ul>                       
                        {menuData2.map((item, index) => (
                            <li key={index}>
                                {
                                    item.mainmenu && item.mainmenu.map((item, ind)=>(
                                        <Fragment key={ind}>
                                            <Link href="#" className="menu-title">{item.title}</Link>
                                            <ul>
                                                {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                    <li key={ind}><Link href={elem.link}>{elem.title}</Link></li>
                                                ))}                                                    
                                            </ul>
                                        </Fragment>
                                    ))    
                                }                                
                            </li>
                        ))}                      
                        <li className="post-menu">
                            <Link href="#" className="menu-title">Recent Posts</Link>
                            <div className="widget widget_post pt-2">
                                <ul>
                                    <li>
                                        <div className="dz-media">
                                            <Image src={IMAGES.ProductSmall1} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link href="/post-standard">Cozy Knit Cardigan Sweater</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <Image src={IMAGES.ProductSmall2} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link href="/post-standard">Sophisticated Swagger Suit</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <Image src={IMAGES.ProductSmall3} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link href="/post-standard">Athletic Mesh Sports Leggings</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <Image src={IMAGES.ProductSmall4} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link href="/post-standard">Satin Wrap Party Blouse</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down auto-width ${state.openMenu === 3 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 3 })}
            >
                <Link href="#"><span>Post Layout</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu">
                    <ul>
                        {menuData3.map((item, index) => (
                            <li key={index}>
                                {
                                    item.mainmenu && item.mainmenu.map((item, ind)=>(
                                        <Fragment key={ind}>
                                            <Link href="#" className="menu-title">{item.title}</Link>
                                            <ul>
                                                {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                    <li key={ind}><Link href={elem.link}>{elem.title}</Link></li>
                                                ))}                                                    
                                            </ul>
                                        </Fragment>
                                    ))    
                                } 
                            </li>
                        ))}    
                    </ul>                   
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 4 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 4 })}
            >
                <Link href="#"><span>Portfolio</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu portfolio-menu">
                    <ul>
                        <li className="side-left">
                            <ul className="portfolio-nav-link">
                                {portfolioMenu.map((elem , ind)=>(
                                    <li key={ind}>
                                        <Link href={elem.url}>
                                            <Image src={elem.image} alt="/" />
                                            <span>{elem.title}</span>
                                        </Link>
                                    </li>
                                ))}                                
                            </ul>
                        </li>
                        <li className="side-right line-left">
                            <Link href="#" className="menu-title">Portfolio Details</Link>
                            <ul>
                                <li><Link href="/portfolio-details-1">Portfolio Details 1</Link></li>
                                <li><Link href="/portfolio-details-2">Portfolio Details 2</Link></li>
                                <li><Link href="/portfolio-details-3">Portfolio Details 3</Link></li>
                                <li><Link href="/portfolio-details-4">Portfolio Details 4</Link></li>
                                <li><Link href="/portfolio-details-5">Portfolio Details 5</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down wide-width ${state.openMenu === 5 ? "open" : ""}`}
               onClick={() => dispatch({ type: 'toggleMenu', index: 5 })}
            >
                <Link href="#" >
                    <span>Pages</span>
                    <i className="fas fa-chevron-down tabindex"/>
                </Link>
                <div className="mega-menu">
                    <ul>             
                        {menuData4.map((data, ind)=>(
                            <li key={ind}>
                                {data.mainMenu && data.mainMenu.map((item, index)=>(
                                    <Fragment key={index}>
                                        <Link href={item.link} className="menu-title">{item.title}</Link>                                        
                                        <ul>
                                            {item.subMenu && item.subMenu.map((elem, i)=>(                                                
                                                <Fragment  key={i}>
                                                    <li><Link href={`${elem.path}`}>{elem.name}</Link></li>
                                                    {elem.outerlink &&
                                                        <li className="w3menulink"><Link href="https://xmenu.indiankoder.com/react/" target="_blank">Menu Styles</Link></li>
                                                    }
                                                </Fragment>
                                            ))}
                                        </ul>
                                    </Fragment>
                                ))}
                            </li>
                        ))}          
                    </ul>
                </div>
            </li>
            <li className={`sub-menu-down ${state.openMenu === 6 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 6 })}
            >
                <Link href="#"><span>My Account</span> <i className="fas fa-chevron-down tabindex"/></Link>
                <ul className="sub-menu">						
                    {accountMenuItem.map((data,index)=>(
                        <li key={index}><Link href={data.url}>{data.name}</Link></li>
                    ))}                    
                </ul>
            </li>
        </ul>
    )
}