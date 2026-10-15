import { Fragment } from "react/jsx-runtime";
// import Menus from "./Menus";
import { Offcanvas } from "react-bootstrap";
import HeaderSidbar from "./HeaderSidbar";
import { useEffect, useReducer } from "react";
import HeadSearchBar from "./HeadSearchBar";
import HeaderSideShoppingCard from "./HeaderSideShopingCard";
import Link from "next/link";
import IMAGES from "../constant/theme";
import { accountMenuItem, menuData2, menuData3, menuData4, menuDataOne, portfolioMenu } from "../constant/Alldata";
import CountdownBlog from "./CountdownBlog";
import Image from "next/image";

interface reduType{
    headerFix: boolean;
    isBottom: boolean;
    isActive: boolean;
    previousScroll: number;
    openSearchBar: boolean;    
    openSidebar: boolean;
    headSideBar: boolean;
    headShoppingSidebar: boolean;
    basketShoppingCard: boolean;
    home: boolean;
    openMenu: number | null,
    // type : string;        
    // index : number;
    
}

type Action =
    | { type: 'FIX_HEADER'; payload: boolean }
    | { type: 'FIX_BOTTOM'; payload: boolean }
    | { type: 'SET_IS_ACTIVE'; payload: boolean }
    | { type: 'SET_PREVIOUS_SCROLL'; payload: number }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'TOGGLE_SEARCH_BAR' }   
    | { type: 'TOGGLE_HEAD_SIDEBAR' }        
    | { type: 'TOGGLE_HEAD_SHOPPING_SIDEBAR' }
    | { type: 'TOGGLE_BASKET_SHOPPING_CARD' }
    | { type: 'TOGGLE_CATEGORY_ACTIVE' }    
    | { type: 'home' }
    | { type: 'toggleMenu'; index: number };

// interface stateType {
//     home: boolean;
//     openMenu: number | null; 
// }

const initialState = {
    headerFix: false,
    isBottom: false,
    isActive: false,
    previousScroll: 0,
    openSearchBar: false,    
    openSidebar: false,
    headSideBar: false,
    headShoppingSidebar: false,
    basketShoppingCard: false,
    home: false,
    openMenu: null,
};

function  reducer (state: reduType, action: Action) : reduType {
    switch (action.type) {
        case 'home':
            return { ...state, home: !state.home };
        case 'toggleMenu':            
            return {
                ...state,
                openMenu: state.openMenu === action.index ? null : action.index,
            };
        case 'FIX_HEADER':
            return { ...state, headerFix: action.payload };
        case 'FIX_BOTTOM':
            return { ...state, isBottom: action.payload };
        case 'SET_IS_ACTIVE':
            return { ...state, isActive: action.payload };
        case 'SET_PREVIOUS_SCROLL':
            return { ...state, previousScroll: action.payload };
        case 'TOGGLE_SEARCH_BAR':
            return { ...state, openSearchBar: !state.openSearchBar };       
        case 'TOGGLE_HEAD_SIDEBAR':
            return { ...state, headSideBar: !state.headSideBar };
        case 'TOGGLE_HEAD_SHOPPING_SIDEBAR':
            return { ...state, headShoppingSidebar: !state.headShoppingSidebar };
        case 'TOGGLE_BASKET_SHOPPING_CARD':
            return { ...state, basketShoppingCard: !state.basketShoppingCard };
        default:
            return state;
    }
};

export default function Header3({setOpenSidebar, openSidebar} : any){
    const [state, dispatch] = useReducer(reducer, initialState);
    const scrollHandler = () => {
        if (window.scrollY > 80) {
            dispatch({ type: 'FIX_HEADER', payload: true });
        } else {
            dispatch({ type: 'FIX_HEADER', payload: false });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth <= 768) {
                const currentScroll = window.scrollY;
                const bodyHeight = document.body.scrollHeight;
                const windowHeight = window.innerHeight;

                dispatch({ type: 'FIX_BOTTOM', payload: currentScroll + windowHeight >= bodyHeight });
                dispatch({ type: 'SET_IS_ACTIVE', payload: currentScroll > state.previousScroll });

                dispatch({ type: 'SET_PREVIOUS_SCROLL', payload: currentScroll });
            }
        };

        const combinedHandler = () => {
            scrollHandler();
            handleScroll();
        };

        window.addEventListener("scroll", combinedHandler);
        return () => {
            window.removeEventListener("scroll", combinedHandler);
        };
    }, [state.previousScroll]);

    let year = new Date().getFullYear();
    return(
        <Fragment>            
            <header className="site-header mo-left header style-3">                            
                <div className={`sticky-header main-bar-wraper ${state.headerFix ? 'is-fixed' : ''}`}>
                    <div className="main-bar clearfix">
                        <div className="container-fluid clearfix">                 
                            <button className={`menu-nav-btn ${openSidebar ? "" : "collapsed"}`}                                 
                                onClick={()=>setOpenSidebar(!openSidebar)}
                            >
                                <span className="for-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span className="dots-close">
                                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="20" height="2.10526" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 22.0635 20.561)" fill="white"/>
                                        <rect x="6.43262" y="20.5611" width="20" height="2.10526" transform="rotate(-45 6.43262 20.5611)" fill="white"/>
                                    </svg>
                                </span>
                            </button>                            
                            <div className="logo-header me-5">
                                <Link href={"/"} >
                                    <Image src={IMAGES.logo} className="logo-dark" alt="logo" />
                                    <Image src={IMAGES.LogoWhiteSvg} className="logo-light" alt="logo" />
                                </Link>
                            </div>
                            
                            {/* <!-- EXTRA NAV --> */}
                            <div className={`extra-nav ${state.isBottom ? "bottom-end" : ""} ${state.isActive ? "active" : ""}`}>
                                <div className="extra-cell">						
                                    <ul className="header-right">
                                        <li className="nav-item login-link">
                                            <Link className="nav-link" href="/signin">
                                                Login / Register
                                            </Link>
                                        </li>
                                        <li className="nav-item search-link">
                                            <Link href={"#"} className="nav-link" 
                                                onClick={()=>dispatch({type : 'TOGGLE_SEARCH_BAR' })}
                                            >
                                                <i className="iconly-Light-Search"/>
                                            </Link>
                                        </li>
                                        <li className="nav-item wishlist-link">
                                            <Link href={"#"} className="nav-link"  
                                                onClick={()=>dispatch({type : 'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}
                                            >
                                                <i className="iconly-Light-Heart2"/>
                                            </Link>
                                        </li>
                                        <li className="nav-item cart-link">
                                            <Link href={"#"}  className="nav-link cart-btn" 
                                                onClick={()=>dispatch({type : 'TOGGLE_BASKET_SHOPPING_CARD'})}
                                            >
                                                <i className="iconly-Broken-Buy"/>
                                                <span className="badge badge-circle">5</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item filte-link">
                                            <Link href={"#"}  className="nav-link filte-btn"  
                                                onClick={()=>dispatch({type:'TOGGLE_HEAD_SIDEBAR'})}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 13" fill="none">
                                                    <rect y="11" width="30" height="2" fill="black"/>
                                                    <rect width="30" height="2" fill="black"/>
                                                </svg>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>                                            
                
            </header>
            {/* <!-- Header End --> */}
            
            <div className={`header-menu navbar-collapse collapse ${openSidebar ? "show" : ""}`} >
                <div className="row h-100">
                    <div className="col-lg-3">
                        <div className="header-nav h-100 nav-dark">
                        <ul className="nav navbar-nav">
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 0 ? 'active open' : ''}`}                
                                onClick={() => dispatch({ type: 'toggleMenu', index: 0 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 0 })}
                            >
                                <Link href="#"><span>Home</span><i className="fas fa-chevron-down tabindex" /></Link>
                                <div className="mega-menu demo-menu">
                                    <div className="row"> 
                                        <div className="col-md-4 col-6"><Link href="/"><Image src={IMAGES.demo1} alt="/" /> <span className="menu-title">01 Home Page</span></Link></div>
                                        <div className="col-md-4 col-6"><Link href="/index-2"><Image src={IMAGES.demo2} alt="/" /> <span className="menu-title">02 Home Page</span></Link></div>
                                        <div className="col-md-4 col-6"><Link href="/index-3"><Image src={IMAGES.demo3} alt="/" /> <span className="menu-title">03 Home Page</span></Link></div>
                                    </div>                                   
                                </div>
                            </li>
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 1 ? 'active open' : ''}`}                
                                onClick={() => dispatch({ type: 'toggleMenu', index: 1 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 1 })}
                            >
                                <Link href="#"><span>Shop</span><i className="fas fa-chevron-down tabindex" /></Link>                      
                                <div className="mega-menu shop-menu">
                                    <div className="row"> 
                                        <div className="col-lg-8 col-md-12 col-sm-12">
                                            <div className="row">
                                                {menuDataOne.map((menu, index) => (
                                                    <div className="col-md-4 col-6" key={index}>
                                                        <Link href="#" className="menu-title">{menu.title}</Link>
                                                        <ul>
                                                            {menu.links.map((link, linkIndex) => (
                                                                <li key={linkIndex}>
                                                                    <Link href={link.path}>{link.name}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}                                               
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="month-deal">
                                                            <div>
                                                                <h3>Deal of the month</h3>
                                                                <p className="mb-0">Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on Pixio <Link href="/shop-standard" className="dz-link-2">View All Products</Link></p>
                                                            </div>
                                                            <div className="sale-countdown">                                                               
                                                                <CountdownBlog />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 d-none d-lg-block">
                                            <div className="adv-media">
                                                <Image src={IMAGES.Adv1} alt="/" />
                                            </div>
                                        </div>
                                    </div>
                                </div>     
                            </li>
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 2 ? "open active" : ""}`}
                                onClick={() => dispatch({ type: 'toggleMenu', index: 2 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 2 })}
                            >
                                <Link href="#"><span>Blog</span><i className="fas fa-chevron-down tabindex"/></Link>
                                <div className="mega-menu">
                                    <div className="row">                       
                                        {menuData2.map((item, index) => (
                                            <div className="col-md-3 col-sm-6 col-6" key={index}>
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
                                            </div>
                                        ))}                      
                                        <div className="col-md-3 col-sm-6 col-12">
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
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 3 ? "open active" : ""}`}
                                onClick={() => dispatch({ type: 'toggleMenu', index: 3 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 3 })}
                            >
                                <Link href="#"><span>Post Layout</span><i className="fas fa-chevron-down tabindex"/></Link>
                                <div className="mega-menu">
                                    <div className="row">
                                        {menuData3.map((item, index) => (
                                            <div className="col-md-3 col-sm-6 col-6" key={index}>
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
                                            </div>
                                        ))}    
                                    </div>                   
                                </div>
                            </li>
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 4 ? "open active" : ""}`}
                                onClick={() => dispatch({ type: 'toggleMenu', index: 4 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 4 })}
                            >
                                <Link href="#"><span>Portfolio</span><i className="fas fa-chevron-down tabindex"/></Link>
                                <div className="mega-menu portfolio-menu">
                                    <div className="row">
                                        <div className="col-xl-10 col-lg-9 col-md-9 pe-xl-5 pe-md-3 col-sm-8">
                                            <ul className="row portfolio-nav-link">
                                                {portfolioMenu.map((elem , ind)=>(
                                                    <li  className="col" key={ind}>
                                                        <Link href={elem.url}>
                                                            <Image src={elem.image} alt="/" />
                                                            <span>{elem.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}                                
                                            </ul>
                                        </div>
                                        <div className="col-xl-2 col-lg-3 col-md-3 line-left ps-3 pe-0 col-sm-4">
                                            <Link href="#" className="menu-title">Portfolio Details</Link>
                                            <ul>
                                                <li><Link href="/portfolio-details-1">Portfolio Details 1</Link></li>
                                                <li><Link href="/portfolio-details-2">Portfolio Details 2</Link></li>
                                                <li><Link href="/portfolio-details-3">Portfolio Details 3</Link></li>
                                                <li><Link href="/portfolio-details-4">Portfolio Details 4</Link></li>
                                                <li><Link href="/portfolio-details-5">Portfolio Details 5</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 5 ? "open active" : ""}`}
                                onClick={() => dispatch({ type: 'toggleMenu', index: 5 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 5 })}
                            >
                                <Link href="#" >
                                    <span>Pages</span>
                                    <i className="fas fa-chevron-down tabindex"/>
                                </Link>
                                <div className="mega-menu">
                                    <div className="row justify-content-md-between">             
                                        {menuData4.map((data, ind)=>(
                                            <div className="col-md-2 col-sm-4 col-6" key={ind}>
                                                {data.mainMenu && data.mainMenu.map((item, index)=>(
                                                    <Fragment key={index}>
                                                        <Link href={item.link} className="menu-title">{item.title}</Link>                                        
                                                        <ul>
                                                            {item.subMenu && item.subMenu.map((elem, i)=>(                                                
                                                                <Fragment key={i}>
                                                                    <li><Link href={`${elem.path}`}>{elem.name}</Link></li>
                                                                    {elem.outerlink &&
                                                                        <li className="w3menulink"><Link href="https://xmenu.indiankoder.com/react/" target="_blank">Menu Styles</Link></li>
                                                                    }
                                                                </Fragment>
                                                            ))}
                                                        </ul>
                                                    </Fragment>
                                                ))}
                                            </div>
                                        ))}          
                                    </div>
                                </div>
                            </li>
                            <li className={`sub-menu-down ${state.openMenu === 6 ? "open active" : ""}`}
                                onClick={() => dispatch({ type: 'toggleMenu', index: 6 })}
                                onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 6 })}
                            >
                                <Link href="#"><span>My Account</span> <i className="fas fa-chevron-down tabindex"/></Link>
                                <ul className="sub-menu">						
                                    {accountMenuItem.map((data,index)=>(
                                        <li key={index}><Link href={data.url}>{data.name}</Link></li>
                                    ))}                    
                                </ul>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
                <div className="right-social-menu">
                    <ul>
                        <li>
                            <Link href={"#"}>example@info.com</Link>
                        </li>
                        <li>
                            <Link href={"#"}>+91 123 456 7890</Link>
                        </li>
                    </ul>	
                    <ul>
                        <li>
                            <Link href={"#"}>Instagram</Link>
                        </li>
                        <li>
                            <Link href={"#"}>Facebook</Link>
                        </li>
                        <li>
                            <Link href={"#"}>twitter</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <p className="mb-0">© <span className="current-year">{year}</span> DexignZone Theme. All Rights Reserved.</p>
                </div>	
            </div>

             {/*  SearchBar  */}
            <Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
                    show={state.openSearchBar} 
                    // onHide={setOpenSearchBar}
                    onHide={()=>dispatch({type: 'TOGGLE_SEARCH_BAR'})}
                    placement={'top'}
                >
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
                    // onClick={()=>setOpenSearchBar(false)}
                    onClick={()=>dispatch({type: 'TOGGLE_SEARCH_BAR'})}
                >
                    &times;
                </button>
                <HeadSearchBar />
            </Offcanvas>

            {/*  Sidebar finter */}
            <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" 
                show={state.headSideBar} 
                // onHide={setHeadSideBar}
                onHide={()=>dispatch({type: 'TOGGLE_HEAD_SIDEBAR'})}
                >
                <button type="button" className="btn-close" 
                    // onClick={()=>setHeadSideBar(false)}
                    onClick={()=>dispatch({type: 'TOGGLE_HEAD_SIDEBAR'})}
                    
                >
                    &times;
                </button>
                <div className="offcanvas-body">
                    <HeaderSidbar />
                </div>
            </Offcanvas>  

            {/*  Sidebar cart  */}
            <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} 
                show={state.headShoppingSidebar} 
                // onHide={setHeadShoppingSidebar}
                onHide={()=>dispatch({type: 'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}
                >
                <button type="button" className="btn-close" 
                    onClick={()=>dispatch({type: 'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}
                    // onClick={()=>setHeadShoppingSidebar(false)}
                >
                    &times;
                </button>
                <div className="offcanvas-body">
                    <div className="product-description">
                        <HeaderSideShoppingCard tabactive="Wishlist" />
                    </div>
                </div>
            </Offcanvas>

            {/*  Shopping Sidebar Basket   */}
            <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} 
                show={state.basketShoppingCard} 
                // onHide={setBasketShoppingCard}
                onHide={()=>dispatch({type :  'TOGGLE_BASKET_SHOPPING_CARD'})}
            >
                <button type="button" className="btn-close" 
                    // onClick={()=>setBasketShoppingCard(false)}
                    onClick={()=>dispatch({type: 'TOGGLE_BASKET_SHOPPING_CARD'})}
                >
                    &times;
                </button>
                <div className="offcanvas-body">
                    <div className="product-description">
                        <HeaderSideShoppingCard tabactive="ShoppingCart" />
                    </div>
                </div>
            </Offcanvas>
        </Fragment>
    )
}