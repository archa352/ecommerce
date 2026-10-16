export const HeaderOne = `
<header className={\`site-header mo-left header \${design}\`}>		
    {/*  Main Header  */}
    <div className={\`sticky-header main-bar-wraper navbar-expand-lg \${headerFix ? 'is-fixed' : ''}\`}>
        <div className="main-bar clearfix">
            <div className="container-fluid clearfix d-lg-flex d-block">                            
                {design === "header-text-white header-transparent" ? 
                    ''
                    :
                    <div className="logo-header logo-dark me-md-5">
                        <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                    </div>
                }
                {design === "header-text-white header-transparent" ? 
                    <div className="logo-header me-md-5">
                        <Link to="/" className=" logo-light"><Image src={IMAGES.LogoWhite} alt="logo-white" /></Link>
                        <Link to="/" className="logo-dark"><Image src={IMAGES.logopng} alt="logo" /></Link>
                    </div>                      
                    :
                    ''
                }
                <button className={\`navbar-toggler collapsed navicon justify-content-end \${openSidebar ? "open" : ""}\`} 
                    onClick={()=>setOpenSidebar(!openSidebar)}
                >
                <span></span>
                <span></span>
                <span></span>
            </button>
                
            {/*  Main Nav  */}
            <div className={\`header-nav w3menu navbar-collapse collapse justify-content-start \${openSidebar ? "show" : ""}\`} 
                id="navbarNavDropdown"                            
            >
                <div className="logo-header logo-dark">
                    <Link to="index"><Image src={IMAGES.logo} alt="logo" /></Link>
                </div>
                {/* All menus item */}
                    <Menus />
                {/* All menus item end*/}
                <div className="dz-social-icon">
                    <ul>
                        <li><Link className="fab fa-facebook-f" target="_blank" to="https://www.facebook.com/dexignzone"></Link></li>
                        <li><Link className="fab fa-twitter" target="_blank" to="https://twitter.com/dexignzones"></Link></li>
                        <li><Link className="fab fa-linkedin-in" target="_blank" to="https://www.linkedin.com/showcase/3686700/admin/"></Link></li>
                        <li><Link className="fab fa-instagram" target="_blank" to="https://www.instagram.com/dexignzone/"></Link></li>
                    </ul>
                </div>
            </div>
            {/* EXTRA NAV  */}
            <div className="extra-nav">
                <div className="extra-cell">						
                    <ul className="header-right">
                        <li className="nav-item login-link">
                            <Link className="nav-link"to="/login">
                                Login / Register
                            </Link>
                        </li>
                        <li className="nav-item search-link">
                            <Link className="nav-link" to="#" 
                                onClick={()=>setOpenSearchBar(true)}
                            >
                                <i className="iconly-Light-Search"/>
                            </Link>
                        </li>
                        <li className="nav-item wishlist-link">
                            <Link className="nav-link" to="#" 
                                onClick={()=>setHeadShoppingSidebar(true)}
                            >
                                <i className="iconly-Light-Heart2"/>
                            </Link>
                        </li>
                        <li className="nav-item cart-link">
                            <Link to="#" className="nav-link cart-btn"  onClick={()=>setBasketShoppingCard(true)}>
                                <i className="iconly-Broken-Buy"/>
                                <span className="badge badge-circle">5</span>
                            </Link>
                        </li>
                        <li className="nav-item filte-link">
                            <Link to="#" className="nav-link filte-btn"
                                onClick={() => setHeadSideBar(true)}
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
    {/*  Main Header End  */}
</header>   
{/*  SearchBar  */}
<Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
        show={openSearchBar} onHide={setOpenSearchBar}
        placement={'top'}
    >
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        onClick={()=>setOpenSearchBar(false)}
    >
        &times;
    </button>
    <HeadSearchBar />
</Offcanvas>
{/*  SearchBar  */}

 {/* - Sidebar finter */}
 <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" show={headSideBar} onHide={setHeadSideBar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadSideBar(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <HeaderSidbar />
    </div>
</Offcanvas>  
{/*  Sidebar cart  */}
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={headShoppingSidebar} onHide={setHeadShoppingSidebar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadShoppingSidebar(false)}
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
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={basketShoppingCard} onHide={setBasketShoppingCard}>
    <button type="button" className="btn-close" 
        onClick={()=>setBasketShoppingCard(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <div className="product-description">
            <HeaderSideShoppingCard tabactive="ShoppingCart" />
        </div>
    </div>
</Offcanvas>`;


export const HeaderTwo = `
<header className="site-header mo-left header style-2">
    <div className="header-info-bar">
        <div className="container clearfix">
            <div className="logo-header logo-dark">
                <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
            </div>
            <div className="extra-nav d-md-flex d-none m-l15">
                <div className="extra-cell">
                    <ul className="navbar-nav header-right m-0">
                        <li className="nav-item info-box">
                            <div className="nav-link">
                                <div className="dz-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path style={{ fill: "#3cc" }} d="..." />
                                        <path d="..." />
                                        <path d="..." />
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
            <div className="header-search-nav">
                <form className="header-item-search">
                    <div className="input-group search-input">
                        <Categorydropdown />
                        <input type="text" className="form-control" aria-label="Text input with dropdown button" placeholder="Search for products" />
                        <button className="btn" type="button">
                            <i className="iconly-Light-Search text-secondary"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div className={\`sticky-header main-bar-wraper navbar-expand-lg \${headerFix ? 'is-fixed' : ''}\`}>
        <div className="main-bar clearfix">
            <div className="container clearfix d-lg-flex d-block">
                <div className="logo-header logo-dark">
                    <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                </div>
                <button className={\`navbar-toggler collapsed navicon justify-content-end \${openSidebar ? "open" : ""}\`}
                    onClick={() => setOpenSidebar(!openSidebar)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={\`header-nav w3menu navbar-collapse collapse justify-content-start \${openSidebar ? "show" : ""}\`}>
                    <div className="logo-header">
                        <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                    </div>
                    <div className="browse-category-menu">
                        <Link to="#" className={\`category-btn \${categoryActive ? "active" : ""}\`} onClick={handleToggleClick}>
                            <div className="category-menu me-3">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="category-btn-title">Browse Categories</span>
                            <span className="toggle-arrow ms-auto">
                                <i className="icon feather icon-chevron-down"></i>
                            </span>
                        </Link>
                        <div className="category-menu-items" style={{
                            display: categoryActive ? "block" : "none",
                            transition: "all 0.5s ease",
                        }}>
                            <CategoryMenuItem />
                        </div>
                    </div>
                    <ul className="nav navbar-nav">
                        <Header2Menus />  
                    </ul>
                    <div className="dz-social-icon">
                        <ul>
                            <li><Link className="fab fa-facebook-f" target="_blank" to="https://www.facebook.com/dexignzone"></Link></li>
                            <li><Link className="fab fa-twitter" target="_blank" to="https://twitter.com/dexignzones"></Link></li>
                            <li><Link className="fab fa-linkedin-in" target="_blank" to="https://www.linkedin.com/showcase/3686700/admin/"></Link></li>
                            <li><Link className="fab fa-instagram" target="_blank" to="https://www.instagram.com/dexignzone/"></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="extra-nav">
                    <div className="extra-cell">
                        <ul className="header-right">
                            <li className="nav-item login-link">
                                <Link className="nav-link" to="/login">Login / Register</Link>
                            </li>
                            <li className="nav-item search-link">
                                <Link to="#" className="nav-link" onClick={() => setOpenSearchBar(true)}>
                                    <i className="iconly-Light-Search"></i>
                                </Link>
                            </li>
                            <li className="nav-item wishlist-link">
                                <Link className="nav-link" to="#" onClick={() => setHeadShoppingSidebar(true)}>
                                    <i className="iconly-Light-Heart2"></i>
                                </Link>
                            </li>
                            <li className="nav-item cart-link">
                                <Link to="#" className="nav-link cart-btn" onClick={() => setBasketShoppingCard(true)}>
                                    <i className="iconly-Broken-Buy"></i>
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
<Offcanvas className="dz-search-area dz-offcanvas offcanvas-top" show={openSearchBar} onHide={setOpenSearchBar} placement={'top'}>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => setOpenSearchBar(false)}>
        &times;
    </button>
    <HeadSearchBar />
</Offcanvas>
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={headShoppingSidebar} onHide={setHeadShoppingSidebar}>
    <button type="button" className="btn-close" onClick={() => setHeadShoppingSidebar(false)}>
        &times;
    </button>
    <div className="offcanvas-body">
        <div className="product-description">
            <HeaderSideShoppingCard tabactive="Wishlist" />
        </div>
    </div>
</Offcanvas>
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={basketShoppingCard} onHide={setBasketShoppingCard}>
    <button type="button" className="btn-close" onClick={() => setBasketShoppingCard(false)}>
        &times;
    </button>
    <div className="offcanvas-body">
        <div className="product-description">
            <HeaderSideShoppingCard tabactive="ShoppingCart" />
        </div>
    </div>
</Offcanvas>
`;
export const HeaderThree = `
<header className="site-header mo-left header style-3">                            
    <div className={\`sticky-header main-bar-wraper \${headerFix ? 'is-fixed' : ''}\`}>
        <div className="main-bar clearfix">
            <div className="container-fluid clearfix">                 
                <button className={\`menu-nav-btn \${openSidebar ? "" : "collapsed"}\`}                                 
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
                    <Link to={"/"} >
                        <Image src={IMAGES.logo} className="logo-dark" alt="logo" />
                        <Image src={IMAGES.LogoWhiteSvg} className="logo-light" alt="logo" />
                    </Link>
                </div>
                
                <div className="extra-nav">
                    <div className="extra-cell">						
                        <ul className="header-right">
                            <li className="nav-item login-link">
                                <Link className="nav-link" to="/login">
                                    Login / Register
                                </Link>
                            </li>
                            <li className="nav-item search-link">
                                <Link to={"#"} className="nav-link" 
                                    onClick={()=>setOpenSearchBar(true)}
                                >
                                    <i className="iconly-Light-Search"/>
                                </Link>
                            </li>
                            <li className="nav-item wishlist-link">
                                <Link to={"#"} className="nav-link"  
                                    onClick={()=>setHeadShoppingSidebar(true)}
                                >
                                    <i className="iconly-Light-Heart2"/>
                                </Link>
                            </li>
                            <li className="nav-item cart-link">
                                <Link to={"#"}  className="nav-link cart-btn" 
                                    onClick={()=>setBasketShoppingCard(true)}
                                >
                                    <i className="iconly-Broken-Buy"/>
                                    <span className="badge badge-circle">5</span>
                                </Link>
                            </li>
                            <li className="nav-item filte-link">
                                <Link to={"#"}  className="nav-link filte-btn"  
                                    onClick={() => setHeadSideBar(true)}
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
<div className={\`header-menu navbar-collapse collapse \${openSidebar ? "show" : ""}\`} >
    <div className="row h-100">
        <div className="col-lg-3">
            <div className="header-nav h-100 nav-dark">
            <ul className="nav navbar-nav">
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 0 ? 'active open' : ''}\`}                
                    onClick={() => dispatch({ type: 'toggleMenu', index: 0 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 0 })}
                >
                    <Link to="#"><span>Home</span><i className="fas fa-chevron-down tabindex" /></Link>
                    <div className="mega-menu demo-menu">
                        <div className="row"> 
                            <div className="col-md-4 col-6"><Link to="/"><Image src={IMAGES.demo1} alt="/" /> <span className="menu-title">01 Home Page</span></Link></div>
                            <div className="col-md-4 col-6"><Link to="/index-2"><Image src={IMAGES.demo2} alt="/" /> <span className="menu-title">02 Home Page</span></Link></div>
                            <div className="col-md-4 col-6"><Link to="/index-3"><Image src={IMAGES.demo3} alt="/" /> <span className="menu-title">03 Home Page</span></Link></div>
                        </div>                                   
                    </div>
                </li>
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 1 ? 'active open' : ''}\`}                
                    onClick={() => dispatch({ type: 'toggleMenu', index: 1 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 1 })}
                >
                    <Link to="#"><span>Shop</span><i className="fas fa-chevron-down tabindex" /></Link>                      
                    <div className="mega-menu shop-menu">
                        <div className="row"> 
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    {menuDataOne.map((menu, index) => (
                                        <div className="col-md-4 col-6" key={index}>
                                            <Link to="#" className="menu-title">{menu.title}</Link>
                                            <ul>
                                                {menu.links.map((link, linkIndex) => (
                                                    <li key={linkIndex}>
                                                        <Link to={link.path}>{link.name}</Link>
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
                                                    <p className="mb-0">Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on Pixio <Link to="/shop-standard" className="dz-link-2">View All Products</Link></p>
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
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 2 ? "open active" : ""}\`}
                    onClick={() => dispatch({ type: 'toggleMenu', index: 2 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 2 })}
                >
                    <Link to="#"><span>Blog</span><i className="fas fa-chevron-down tabindex"/></Link>
                    <div className="mega-menu">
                        <div className="row">                       
                            {menuData2.map((item, index) => (
                                <div className="col-md-3 col-sm-6 col-6" key={index}>
                                    {
                                        item.mainmenu && item.mainmenu.map((item, ind)=>(
                                            <Fragment key={ind}>
                                                <Link to="#" className="menu-title">{item.title}</Link>
                                                <ul>
                                                    {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                        <li key={ind}><Link to={elem.link}>{elem.title}</Link></li>
                                                    ))}                                                    
                                                </ul>
                                            </Fragment>
                                        ))    
                                    }                                
                                </div>
                            ))}                      
                            <div className="col-md-3 col-sm-6 col-12">
                                <Link to="#" className="menu-title">Recent Posts</Link>
                                <div className="widget widget_post pt-2">
                                    <ul>
                                        <li>
                                            <div className="dz-media">
                                                <Image src={IMAGES.ProductSmall1} alt="small" />
                                            </div>
                                            <div className="dz-content">
                                                <h6 className="name"><Link to="/post-standard">Cozy Knit Cardigan Sweater</Link></h6>
                                                <span className="time">July 23, 2024</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dz-media">
                                                <Image src={IMAGES.ProductSmall2} alt="small" />
                                            </div>
                                            <div className="dz-content">
                                                <h6 className="name"><Link to="/post-standard">Sophisticated Swagger Suit</Link></h6>
                                                <span className="time">July 23, 2024</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dz-media">
                                                <Image src={IMAGES.ProductSmall3} alt="small" />
                                            </div>
                                            <div className="dz-content">
                                                <h6 className="name"><Link to="/post-standard">Athletic Mesh Sports Leggings</Link></h6>
                                                <span className="time">July 23, 2024</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dz-media">
                                                <Image src={IMAGES.ProductSmall4} alt="small" />
                                            </div>
                                            <div className="dz-content">
                                                <h6 className="name"><Link to="/post-standard">Satin Wrap Party Blouse</Link></h6>
                                                <span className="time">July 23, 2024</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 3 ? "open active" : ""}\`}
                    onClick={() => dispatch({ type: 'toggleMenu', index: 3 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 3 })}
                >
                    <Link to="#"><span>Post Layout</span><i className="fas fa-chevron-down tabindex"/></Link>
                    <div className="mega-menu">
                        <div className="row">
                            {menuData3.map((item, index) => (
                                <div className="col-md-3 col-sm-6 col-6" key={index}>
                                    {
                                        item.mainmenu && item.mainmenu.map((item, ind)=>(
                                            <Fragment key={ind}>
                                                <Link to="#" className="menu-title">{item.title}</Link>
                                                <ul>
                                                    {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                        <li key={ind}><Link to={elem.link}>{elem.title}</Link></li>
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
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 4 ? "open active" : ""}\`}
                    onClick={() => dispatch({ type: 'toggleMenu', index: 4 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 4 })}
                >
                    <Link to="#"><span>Portfolio</span><i className="fas fa-chevron-down tabindex"/></Link>
                    <div className="mega-menu portfolio-menu">
                        <div className="row">
                            <div className="col-xl-10 col-lg-9 col-md-9 pe-xl-5 pe-md-3 col-sm-8">
                                <ul className="row portfolio-nav-link">
                                    {portfolioMenu.map((elem , ind)=>(
                                        <li  className="col" key={ind}>
                                            <Link to={elem.url}>
                                                <Image src={elem.image} alt="/" />
                                                <span>{elem.title}</span>
                                            </Link>
                                        </li>
                                    ))}                                
                                </ul>
                            </div>
                            <div className="col-xl-2 col-lg-3 col-md-3 line-left ps-3 pe-0 col-sm-4">
                                <Link to="#" className="menu-title">Portfolio Details</Link>
                                <ul>
                                    <li><Link to="/portfolio-details-1">Portfolio Details 1</Link></li>
                                    <li><Link to="/portfolio-details-2">Portfolio Details 2</Link></li>
                                    <li><Link to="/portfolio-details-3">Portfolio Details 3</Link></li>
                                    <li><Link to="/portfolio-details-4">Portfolio Details 4</Link></li>
                                    <li><Link to="/portfolio-details-5">Portfolio Details 5</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li className={\`has-mega-menu sub-menu-down \${state.openMenu === 5 ? "open active" : ""}\`}
                    onClick={() => dispatch({ type: 'toggleMenu', index: 5 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 5 })}
                >
                    <Link to="#" >
                        <span>Pages</span>
                        <i className="fas fa-chevron-down tabindex"/>
                    </Link>
                    <div className="mega-menu">
                        <div className="row justify-content-md-between">             
                            {menuData4.map((data, ind)=>(
                                <div className="col-md-2 col-sm-4 col-6" key={ind}>
                                    {data.mainMenu && data.mainMenu.map((item, index)=>(
                                        <Fragment key={index}>
                                            <Link to={item.link} className="menu-title">{item.title}</Link>                                        
                                            <ul>
                                                {item.subMenu && item.subMenu.map((elem, i)=>(                                                
                                                    <Fragment>
                                                        <li key={i}><Link to={\`\${elem.path}\`}>{elem.name}</Link></li>
                                                        {elem.outerlink &&
                                                            <li className="w3menulink"><Link to="https://xmenu.indiankoder.com/react/" target="_blank">Menu Styles</Link></li>
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
                <li className={\`sub-menu-down \${state.openMenu === 6 ? "open active" : ""}\`}
                    onClick={() => dispatch({ type: 'toggleMenu', index: 6 })}
                    onMouseEnter={() => dispatch({ type: 'toggleMenu', index: 6 })}
                >
                    <Link to="#"><span>My Account</span> <i className="fas fa-chevron-down tabindex"/></Link>
                    <ul className="sub-menu">						
                        {accountMenuItem.map((data,index)=>(
                            <li key={index}><Link to={data.url}>{data.name}</Link></li>
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
                <Link to={"#"}>example@info.com</Link>
            </li>
            <li>
                <Link to={"#"}>+91 123 456 7890</Link>
            </li>
        </ul>	
        <ul>
            <li>
                <Link to={"#"}>Instagram</Link>
            </li>
            <li>
                <Link to={"#"}>Facebook</Link>
            </li>
            <li>
                <Link to={"#"}>twitter</Link>
            </li>
        </ul>
    </div>
    <div className="footer-menu">
        <p className="mb-0">© <span className="current-year">{year}</span> DexignZone Theme. All Rights Reserved.</p>
    </div>	
</div>
<Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
    show={openSearchBar} onHide={setOpenSearchBar}
    placement={'top'}
>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        onClick={()=>setOpenSearchBar(false)}
    >
        &times;
    </button>
 <HeadSearchBar />
</Offcanvas>

{/*  Sidebar finter */}
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" show={headSideBar} onHide={setHeadSideBar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadSideBar(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <HeaderSidbar />
    </div>
</Offcanvas>  

{/*  Sidebar cart  */}
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={headShoppingSidebar} onHide={setHeadShoppingSidebar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadShoppingSidebar(false)}
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
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={basketShoppingCard} onHide={setBasketShoppingCard}>
    <button type="button" className="btn-close" 
        onClick={()=>setBasketShoppingCard(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <div className="product-description">
            <HeaderSideShoppingCard tabactive="ShoppingCart" />
        </div>
    </div>
</Offcanvas>
`;
export const HeaderSix = `
    <header className={\`site-header mo-left header\`}>		
        <div className="top-bar">
            <div className="container-fluid">
                <div className="dz-topbar-inner d-flex justify-content-between align-items-center">
                    <div className="dz-topbar-left">
                        <ul>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/contact-us-1">Contact Us</Link></li>
                            <li><Link to="/faqs-2">Help Desk</Link></li>
                        </ul>
                    </div>
                    <div className="dz-topbar-right">
                        <ul>
                            <li><span>Share:</span></li>
                            <li><Link to="https://www.facebook.com/dexignzone" target="_blank"><i className="fa-brands fa-facebook-f"/></Link></li>
                            <li><Link to="https://www.linkedin.com/showcase/3686700/admin/" target="_blank"><i className="fa-brands fa-linkedin-in"/></Link></li>
                            <li><Link to="https://www.instagram.com/dexignzone/" target="_blank"><i className="fa-brands fa-instagram"/></Link></li>
                            <li><Link to="https://twitter.com/dexignzones" target="_blank"><i className="fa-brands fa-twitter"/></Link></li>
                        </ul>					
                    </div>
                </div>
            </div>
        </div>        
        <div className={\`sticky-header main-bar-wraper navbar-expand-lg \${headerFix ? 'is-fixed' : ''}\`}>
            <div className="main-bar clearfix">
                <div className="container-fluid clearfix d-lg-flex d-block">                            
                     <div className="logo-header logo-dark me-md-5">
                        <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                    </div>
                    <button className={\`navbar-toggler collapsed navicon justify-content-end \${openSidebar ? "open" : ""}\`} 
                        onClick={()=>setOpenSidebar(!openSidebar)}
                    >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>                    
              
                <div className={\`header-nav w3menu navbar-collapse collapse justify-content-start \${openSidebar ? "show" : ""}\`} 
                    id="navbarNavDropdown"                            
                >
                    <div className="logo-header logo-dark">
                        <Link to="index"><Image src={IMAGES.logo} alt="logo" /></Link>
                    </div>
                    
                    <Menus />
                    
                    <div className="dz-social-icon">
                        <ul>
                            <li><Link className="fab fa-facebook-f" target="_blank" to="https://www.facebook.com/dexignzone"></Link></li>
                            <li><Link className="fab fa-twitter" target="_blank" to="https://twitter.com/dexignzones"></Link></li>
                            <li><Link className="fab fa-linkedin-in" target="_blank" to="https://www.linkedin.com/showcase/3686700/admin/"></Link></li>
                            <li><Link className="fab fa-instagram" target="_blank" to="https://www.instagram.com/dexignzone/"></Link></li>
                        </ul>
                    </div>
                </div>
               
                <div className="extra-nav">
                    <div className="extra-cell">						
                        <ul className="header-right">
                            <li className="nav-item login-link">
                                <Link className="nav-link"to="/login">
                                    Login / Register
                                </Link>
                            </li>
                            <li className="nav-item search-link">
                                <Link className="nav-link" to="#" 
                                    onClick={()=>setOpenSearchBar(true)}
                                >
                                    <i className="iconly-Light-Search"/>
                                </Link>
                            </li>
                            <li className="nav-item wishlist-link">
                                <Link className="nav-link" to="#" 
                                    onClick={()=>setHeadShoppingSidebar(true)}
                                >
                                    <i className="iconly-Light-Heart2"/>
                                </Link>
                            </li>
                            <li className="nav-item cart-link">
                                <Link to="#" className="nav-link cart-btn"  onClick={()=>setBasketShoppingCard(true)}>
                                    <i className="iconly-Broken-Buy"/>
                                    <span className="badge badge-circle">5</span>
                                </Link>
                            </li>
                            <li className="nav-item filte-link">
                                <Link to="#" className="nav-link filte-btn"
                                    onClick={() => setHeadSideBar(true)}
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
    {/*  SearchBar  */}
    <Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
            show={openSearchBar} onHide={setOpenSearchBar}
            placement={'top'}
        >
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
            onClick={()=>setOpenSearchBar(false)}
        >
            &times;
        </button>
        <HeadSearchBar />
    </Offcanvas>
    {/*  SearchBar  */}

    {/* - Sidebar finter */}
    <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" show={headSideBar} onHide={setHeadSideBar}>
        <button type="button" className="btn-close" 
            onClick={()=>setHeadSideBar(false)}
        >
            &times;
        </button>
        <div className="offcanvas-body">
            <HeaderSidbar />
        </div>
    </Offcanvas>  
    {/*  Sidebar cart  */}
    <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={headShoppingSidebar} onHide={setHeadShoppingSidebar}>
        <button type="button" className="btn-close" 
            onClick={()=>setHeadShoppingSidebar(false)}
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
    <Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={basketShoppingCard} onHide={setBasketShoppingCard}>
        <button type="button" className="btn-close" 
            onClick={()=>setBasketShoppingCard(false)}
        >
            &times;
        </button>
        <div className="offcanvas-body">
            <div className="product-description">
                <HeaderSideShoppingCard tabactive="ShoppingCart" />
            </div>
        </div>
</Offcanvas>`;

export const HeaderSeven = `
<header className={\`site-header mo-left header\`}>		
    <div className="top-bar bg-primary text-white">
        <div className="container-fluid">
            <div className="dz-topbar-inner d-flex justify-content-between align-items-center">
                <div className="dz-topbar-left">
                    <ul>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us-1">Contact Us</Link></li>
                        <li><Link to="/faqs-2">Help Desk</Link></li>
                    </ul>
                </div>
                <div className="dz-topbar-right">
                    <ul>
                        <li><span>Share:</span></li>
                        <li><Link to="https://www.facebook.com/dexignzone" target="_blank"><i className="fa-brands fa-facebook-f"/></Link></li>
                        <li><Link to="https://www.linkedin.com/showcase/3686700/admin/" target="_blank"><i className="fa-brands fa-linkedin-in"/></Link></li>
                        <li><Link to="https://www.instagram.com/dexignzone/" target="_blank"><i className="fa-brands fa-instagram"/></Link></li>
                        <li><Link to="https://twitter.com/dexignzones" target="_blank"><i className="fa-brands fa-twitter"/></Link></li>
                    </ul>					
                </div>
            </div>
        </div>
    </div>
    {/*  Main Header  */}
    <div className={\`sticky-header main-bar-wraper navbar-expand-lg \${headerFix ? 'is-fixed' : ''}\`}>
        <div className="main-bar clearfix">
            <div className="container-fluid clearfix d-lg-flex d-block">                            
                    <div className="logo-header logo-dark me-md-5">
                    <Link to="/"><Image src={IMAGES.logo} alt="logo" /></Link>
                </div>
                <button className={\`navbar-toggler collapsed navicon justify-content-end \${openSidebar ? "open" : ""}\`} 
                    onClick={()=>setOpenSidebar(!openSidebar)}
                >
                <span></span>
                <span></span>
                <span></span>
            </button>
                
            {/*  Main Nav  */}
            <div className={\`header-nav w3menu navbar-collapse collapse justify-content-start \${openSidebar ? "show" : ""}\`} 
                id="navbarNavDropdown"                            
            >
                <div className="logo-header logo-dark">
                    <Link to="index"><Image src={IMAGES.logo} alt="logo" /></Link>
                </div>
                {/* All menus item */}
                    <Menus />
                {/* All menus item end*/}
                <div className="dz-social-icon">
                    <ul>
                        <li><Link className="fab fa-facebook-f" target="_blank" to="https://www.facebook.com/dexignzone"></Link></li>
                        <li><Link className="fab fa-twitter" target="_blank" to="https://twitter.com/dexignzones"></Link></li>
                        <li><Link className="fab fa-linkedin-in" target="_blank" to="https://www.linkedin.com/showcase/3686700/admin/"></Link></li>
                        <li><Link className="fab fa-instagram" target="_blank" to="https://www.instagram.com/dexignzone/"></Link></li>
                    </ul>
                </div>
            </div>
            {/* EXTRA NAV  */}
            <div className="extra-nav">
                <div className="extra-cell">						
                    <ul className="header-right">
                        <li className="nav-item login-link">
                            <Link className="nav-link"to="/login">
                                Login / Register
                            </Link>
                        </li>
                        <li className="nav-item search-link">
                            <Link className="nav-link" to="#" 
                                onClick={()=>setOpenSearchBar(true)}
                            >
                                <i className="iconly-Light-Search"/>
                            </Link>
                        </li>
                        <li className="nav-item wishlist-link">
                            <Link className="nav-link" to="#" 
                                onClick={()=>setHeadShoppingSidebar(true)}
                            >
                                <i className="iconly-Light-Heart2"/>
                            </Link>
                        </li>
                        <li className="nav-item cart-link">
                            <Link to="#" className="nav-link cart-btn"  onClick={()=>setBasketShoppingCard(true)}>
                                <i className="iconly-Broken-Buy"/>
                                <span className="badge badge-circle">5</span>
                            </Link>
                        </li>
                        <li className="nav-item filte-link">
                            <Link to="#" className="nav-link filte-btn"
                                onClick={() => setHeadSideBar(true)}
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
    {/*  Main Header End  */}
</header>   
{/*  SearchBar  */}
<Offcanvas className="dz-search-area dz-offcanvas offcanvas-top"
        show={openSearchBar} onHide={setOpenSearchBar}
        placement={'top'}
    >
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        onClick={()=>setOpenSearchBar(false)}
    >
        &times;
    </button>
    <HeadSearchBar />
</Offcanvas>
{/*  SearchBar  */}

{/* - Sidebar finter */}
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" show={headSideBar} onHide={setHeadSideBar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadSideBar(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <HeaderSidbar />
    </div>
</Offcanvas>  
{/*  Sidebar cart  */}
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={headShoppingSidebar} onHide={setHeadShoppingSidebar}>
    <button type="button" className="btn-close" 
        onClick={()=>setHeadShoppingSidebar(false)}
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
<Offcanvas className="dz-offcanvas offcanvas-end" placement="end" tabIndex={-1} show={basketShoppingCard} onHide={setBasketShoppingCard}>
    <button type="button" className="btn-close" 
        onClick={()=>setBasketShoppingCard(false)}
    >
        &times;
    </button>
    <div className="offcanvas-body">
        <div className="product-description">
            <HeaderSideShoppingCard tabactive="ShoppingCart" />
        </div>
    </div>
</Offcanvas>
`;