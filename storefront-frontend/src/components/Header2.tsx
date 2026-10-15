"use client"
import { Offcanvas } from "react-bootstrap";
import IMAGES from "../constant/theme";
import { Fragment, useEffect, useReducer } from "react";
import Link from "next/link";
import HeadSearchBar from "./HeadSearchBar";
import HeaderSideShoppingCard from "./HeaderSideShopingCard";
import Header2Menus from "./Header2Menus";
import CategoryMenuItem from "./CategoryMenuItem";
import Categorydropdown from "./CategoryDropdown";
import Image from "next/image";


interface State {
    headerFix: boolean;
    isBottom: boolean;
    isActive: boolean;
    previousScroll: number;
    openSidebar: boolean;
    openSearchBar: boolean;    
    headShoppingSidebar: boolean;
    basketShoppingCard: boolean;
    categoryActive: boolean;
}

type Action =
    | { type: 'FIX_HEADER'; payload: boolean }
    | { type: 'FIX_BOTTOM'; payload: boolean }
    | { type: 'SET_IS_ACTIVE'; payload: boolean }
    | { type: 'SET_PREVIOUS_SCROLL'; payload: number }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'TOGGLE_SEARCH_BAR' }    
    | { type: 'TOGGLE_HEAD_SHOPPING_SIDEBAR' }
    | { type: 'TOGGLE_BASKET_SHOPPING_CARD' }
    | { type: 'TOGGLE_CATEGORY_ACTIVE' };


const initialState = {
    headerFix: false,
    isBottom: false,
    isActive: false,
    previousScroll: 0,
    openSidebar: false,
    openSearchBar: false,    
    headShoppingSidebar: false,
    basketShoppingCard: false,
    categoryActive: false,
};

function reducer(state : State, action : Action) : State {
    switch (action.type) {
        case 'FIX_HEADER':
            return { ...state, headerFix: action.payload };
        case 'FIX_BOTTOM':
            return { ...state, isBottom: action.payload };
        case 'SET_IS_ACTIVE':
            return { ...state, isActive: action.payload };
        case 'SET_PREVIOUS_SCROLL':
            return { ...state, previousScroll: action.payload };
        case 'TOGGLE_SIDEBAR':
            return { ...state, openSidebar: !state.openSidebar };
        case 'TOGGLE_SEARCH_BAR':
            return { ...state, openSearchBar: !state.openSearchBar };       
        case 'TOGGLE_HEAD_SHOPPING_SIDEBAR':
            return { ...state, headShoppingSidebar: !state.headShoppingSidebar };
        case 'TOGGLE_BASKET_SHOPPING_CARD':
            return { ...state, basketShoppingCard: !state.basketShoppingCard };
        case 'TOGGLE_CATEGORY_ACTIVE':
            return { ...state, categoryActive: !state.categoryActive };
        default:
            throw new Error();
    }
}

export default function Header2() {       
    const [state, dispatch] = useReducer(reducer, initialState);    
    const scrollHandler = () => {
        if (window.scrollY > 80) {
            dispatch({ type: 'FIX_HEADER', payload: true });
        } else {
            dispatch({ type: 'FIX_HEADER', payload: false });
        }
    };
    const handleToggleClick = () => {
        dispatch({ type: 'TOGGLE_CATEGORY_ACTIVE' }); 
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
    return (
        <Fragment>
            <header className="site-header mo-left header style-2">
                <div className="header-info-bar">
                    <div className="container clearfix">
                        {/* <!-- Website Logo --> */}
                        <div className="logo-header logo-dark">
                            <Link href="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                        </div>
                        {/* <!-- EXTRA NAV --> */}
                        <div className="extra-nav d-md-flex d-none m-l15">
                            <div className="extra-cell">
                                <ul className="navbar-nav header-right m-0">
                                    <li className="nav-item info-box ">
                                        <div className="nav-link">
                                            <div className="dz-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
                                                    <path style={{ fill: "#3cc" }} d="M489.343 210.251c-4.827-105.317-92.01-189.513-198.498-189.513h-69.689c-106.488 0-193.67 84.197-198.498 189.513C9.495 214.747 0 227.228 0 241.894v78.61c0 18.436 15 33.436 33.437 33.436h60.996c6.075 0 11-4.925 11-11V219.458c0-6.075-4.925-11-11-11H44.789c5.699-92.338 82.618-165.72 176.366-165.72h69.689c93.749 0 170.667 73.381 176.366 165.72h-49.644c-6.075 0-11 4.925-11 11V342.94c0 6.075 4.925 11 11 11h60.996c18.436 0 33.436-15 33.436-33.436v-78.61c.002-14.666-9.493-27.147-22.655-31.643zM83.433 331.94H33.437c-6.306 0-11.437-5.13-11.437-11.436v-78.61c0-6.306 5.131-11.436 11.437-11.436h49.996V331.94zM490 320.504c0 6.306-5.131 11.436-11.436 11.436h-49.996V230.458h49.996c6.306 0 11.436 5.13 11.436 11.436v78.61z" /><path d="M256 491.262a11.001 11.001 0 0 1-8.402-3.9l-52.108-61.671h-74.566c-20.673 0-37.491-16.818-37.491-37.49V188.049c0-20.673 16.818-37.491 37.491-37.491h270.154c20.672 0 37.49 16.818 37.49 37.491V388.2c0 20.672-16.818 37.49-37.49 37.49h-74.566l-52.108 61.671a11.006 11.006 0 0 1-8.404 3.901zM120.923 172.558c-8.542 0-15.491 6.949-15.491 15.491V388.2c0 8.541 6.949 15.49 15.491 15.49h79.673c3.238 0 6.312 1.427 8.402 3.9L256 463.218l47.002-55.627a10.998 10.998 0 0 1 8.402-3.9h79.673c8.541 0 15.49-6.949 15.49-15.49V188.049c0-8.542-6.949-15.491-15.49-15.491H120.923z" /><path d="M193.81 259.09c-8.663.084-14.039-9.956-9.139-17.11 4.134-6.475 14.16-6.434 18.29 0 4.892 7.164-.483 17.196-9.151 17.11zM311.729 259.09c-7.629.166-13.258-8.219-10.16-15.21 3.614-8.972 16.705-8.978 20.31 0 3.113 6.979-2.526 15.376-10.15 15.21zM256 352.204c-25.31 0-50.619-10.009-73.192-30.028-4.545-4.03-4.962-10.982-.931-15.528 4.029-4.545 10.982-4.962 15.528-.931 36.689 32.536 80.501 32.538 117.19 0 4.547-4.031 11.497-3.614 15.528.931 4.031 4.546 3.614 11.498-.931 15.528-22.572 20.019-47.882 30.028-73.192 30.028z" />
                                                </svg>
                                            </div>
                                            <div className="info-content">
                                                <span>24/7 SUPPORT</span>
                                                <h6 className="title mb-0">+123 456 789</h6>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- header search nav --> */}
                        <div className="header-search-nav">
                            <form className="header-item-search">
                                <div className="input-group search-input">
                                    <Categorydropdown />  
                                    <input type="text" className="form-control text-hide me-1" aria-label="Text input with dropdown button" placeholder="Search for products" />
                                    <button className="btn" type="button">
                                        <i className="iconly-Light-Search text-secondary"/>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>



                <div className={`sticky-header main-bar-wraper navbar-expand-lg ${state.headerFix ? 'is-fixed' : ''}`}>
                    <div className="main-bar clearfix">
                        <div className="container clearfix d-lg-flex d-block">
                            {/* <!-- Website Logo --> */}
                            <div className="logo-header logo-dark">
                                <Link href="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                            </div>

                            {/* <!-- Nav Toggle Button --> */}
                            <button className={`navbar-toggler collapsed navicon justify-content-end ${state.openSidebar ? "open" : ""}` }                                
                                onClick={()=>dispatch({type : "TOGGLE_SIDEBAR"})}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>

                            {/* <!-- Main Nav --> */}
                            <div className={`header-nav w3menu navbar-collapse collapse justify-content-start ${state.openSidebar ? "show" : ""}`}>
                                <div className="logo-header">
                                    <Link href="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                                </div>
                                <div className="browse-category-menu">
                                    <Link href="#" className={`category-btn ${state.categoryActive ? "active" : ""}`}
                                        onClick={handleToggleClick}
                                    >
                                        <div className="category-menu me-3">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <span className="category-btn-title">
                                            Browse Categories
                                        </span>
                                        <span className="toggle-arrow ms-auto">
                                            <i className="icon feather icon-chevron-down"/>
                                        </span>
                                    </Link>
                                    <div className="category-menu-items" 
                                        style={{
                                            display: state.categoryActive ? "block" : "none",
                                            transition: "all 0.5s ease",
                                        }}    
                                    >
                                       <CategoryMenuItem />
                                    </div>
                                </div>
                                <ul className="nav navbar-nav">                                    
                                    {/* All menus item */}
                                        <Header2Menus />
                                    {/* All menus item end*/}
                                </ul>
                                <div className="dz-social-icon">
                                    <ul>
                                        <li><Link className="fab fa-facebook-f" target="_blank" href="https://www.facebook.com/dexignzone"></Link></li>
                                        <li><Link className="fab fa-twitter" target="_blank" href="https://twitter.com/dexignzones"></Link></li>
                                        <li><Link className="fab fa-linkedin-in" target="_blank" href="https://www.linkedin.com/showcase/3686700/admin/"></Link></li>
                                        <li><Link className="fab fa-instagram" target="_blank" href="https://www.instagram.com/dexignzone/"></Link></li>
                                    </ul>
                                </div>
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
                                                onClick={()=>dispatch({type : 'TOGGLE_SEARCH_BAR'})}
                                            >
                                                <i className="iconly-Light-Search"/>
                                            </Link>
                                        </li>
                                        <li className="nav-item wishlist-link">
                                            <Link className="nav-link" href={"#"}                                                 
                                                onClick={()=>dispatch({type : 'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}
                                            >
                                                <i className="iconly-Light-Heart2"/>
                                            </Link>
                                        </li>
                                        <li className="nav-item cart-link">
                                            <Link href={"#"} className="nav-link cart-btn"                                                 
                                                onClick={()=>dispatch({type : 'TOGGLE_BASKET_SHOPPING_CARD'})}
                                            >
                                                <i className="iconly-Broken-Buy"/>
                                                <span className="badge badge-circle">5</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </header>
            
            {/*  SearchBar  */}
            <Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
                    show={state.openSearchBar} onHide={()=>dispatch({type :'TOGGLE_SEARCH_BAR'})}
                    placement={'top'}
                >
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"                    
                    onClick={()=>dispatch({type :'TOGGLE_SEARCH_BAR'})}
                >
                    &times;
                </button>
                <HeadSearchBar />
            </Offcanvas>
            {/*  SearchBar  */}

            {/*  Sidebar cart  */}
            <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={state.headShoppingSidebar} 
                onHide={()=>dispatch({type :'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}
            >
                <button type="button" className="btn-close"                     
                    onClick={()=>dispatch({type :'TOGGLE_HEAD_SHOPPING_SIDEBAR'})}                    
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
            <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={state.basketShoppingCard}                 
                onHide={()=>dispatch({type :'TOGGLE_BASKET_SHOPPING_CARD'})}
            >
                <button type="button" className="btn-close"                     
                    onClick={()=>dispatch({type :'TOGGLE_BASKET_SHOPPING_CARD'})}
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