export const AllMenu = [
  {
    menu: "Home",
    className: "sub-menu-down",
    ulClassName: "sub-menu",
    submenu: [
      { child: "01 Home Page", to: "/" },
      { child: "02 Home Page", to: "/index-2" },
      { child: "03 Home Page", to: "/index-3" },
    ],
  },
  {
    menu: "Shop",
    className: "has-mega-menu sub-menu-down",
    ulClassName: "mega-menu",
    extraImg: true,    
    submenu: [
      {
        child: "Shop Structure",
        subchild: [
          { children: "Shop Standard", to: "/shop-standard" },
          { children: "Shop List", to: "/shop-list" },
          { children: "Shop With Category", to: "/shop-with-category" },
          { children: "Shop Filters Top Bar", to: "/shop-filters-top-bar" },
          { children: "Shop Sidebar", to: "/shop-sidebar" },
          { children: "Shop Style 1", to: "/shop-style-1" },
          { children: "Shop Style 2", to: "/shop-style-2" }        
        ],
      },
      {
        child: "Product Structure",
        subchild: [
          { children: "Default", to: "/product-default" },
          { children: "Thumbnail", to: "/product-thumbnail" },
          { children: "Grid Media", to: "/product-grid-media" },
          { children: "Carousel", to: "/product-carousel" },
          { children: "Full Width", to: "/product-full-width" },
        ],
      },
      {
        child: "Shop Pages",
        subchild: [
          { children: "Wishlist", to: "/shop-wishlist" },          
          { children: "Cart", to: "/shop-cart" },          
          { children: "Checkout", to: "/shop-checkout" },          
          { children: "Compare", to: "/shop-compare" },          
          { children: "Order Tracking", to: "/shop-order-tracking" },          
          { children: "Login", to: "/login" },          
          { children: "Registration", to: "/registration" },          
        ],
      },
    ],
  },
  {
    menu: "Blog",    
    className: "has-mega-menu sub-menu-down auto-width",
    extraImg: false,   
    
    submenu: [
      {
        child: "Blog Dark Style",
        subchild: [
          { children: "Blog 2 Column", to: "/blog-dark-2-column" },
          { children: "Blog 2 Column Sidebar", to: "/blog-dark-2-column-sidebar" },
          { children: "Blog 3 Column", to: "/blog-dark-3-column" },
          { children: "Blog Half Image", to: "/blog-dark-half-image" },          
        ],
      },
      {
        child: "Blog Light Style",
        subchild: [
          { children: "Blog 2 Column", to: "/blog-light-2-column" },         
          { children: "Blog 2 Column Sidebar", to: "/blog-light-2-column-sidebar" },         
          { children: "Blog Half Image", to: "/blog-light-half-image" },         
          { children: "Blog Exclusive", to: "/blog-exclusive" },         
        ],
      },
      {
        child: "Blog List Sidebar",
        subchild: [
          { children: "No Sidebar", to: "/blog-list-no-sidebar" },         
          { children: "left Sidebar", to: "/blog-list-left-sidebar" },         
          { children: "Right Sidebar", to: "/blog-list-right-sidebar" },         
          { children: "Both Sidebar", to: "/blog-list-both-sidebar" },         
        ],
      },
      {
        child: "Blog Grid Sidebar",
        subchild: [
          { children: "No Sidebar", to: "/blog-grid-no-sidebar" },         
          { children: "left Sidebar ", to: "/blog-grid-left-sidebar" },         
          { children: "Right Sidebar", to: "/blog-grid-right-sidebar" },         
          { children: "Both Sidebar", to: "/blog-grid-both-sidebar" },         
          { children: "Wide Sidebar", to: "/blog-grid-wide-sidebar" },         
        ],
      },
      {
        child: "Blog Grid Sidebar",
        subchild: [
          { children: "No Sidebar", to: "/blog-grid-no-sidebar" },         
          { children: "left Sidebar ", to: "/blog-grid-left-sidebar" },         
          { children: "Right Sidebar", to: "/blog-grid-right-sidebar" },         
          { children: "Both Sidebar", to: "/blog-grid-both-sidebar" },         
          { children: "Wide Sidebar", to: "/blog-grid-wide-sidebar" },         
        ],
      },
      {
        child : "Blog Page",
        subchild: [
          { children: "Blog Archive", to: "/blog-archive" },
          { children: "Author", to: "/blog-author" },
          { children: "Blog Category", to: "/blog-category" },
          { children: "Blog Tag", to: "/blog-tag" },
        ]
      },
      
    ],
  
  },
  {
    className: "sub-menu-down",
    menu : "Post Layout",
    submenu: [
      {
        child: "Post Types",
        subchild: [
          { children: "Text Post", to: "/post-text" },
          { children: "Image Post", to: "/post-image" },
          { children: "Video Post", to: "/post-video" },
          { children: "Link Post", to: "/post-link" },
          { children: "Audio Post", to: "/post-audio" },
          { children: "Post Quote", to: "/post-quote" },
          { children: "Tutorial Post", to: "/post-tutorial" },
          { children: "Cateloge Post", to: "/post-cateloge" },
                 
        ],
      },
      {
        child : "Multiple Media",
        subchild: [
          { children: "Banner", to: "/post-banner" },
          { children: "Slider", to: "/post-slide-show" },
          { children: "Gallery", to: "/post-gallery" },
          { children: "Status Slider", to: "/post-status" },
        ]
      },
      {
        child : "Post Layout Type",
        subchild: [
          { children: "Standard Post", to: "/post-standard" },
          { children: "Corner Post", to: "/post-corner" },
          { children: "Side Post", to: "/post-side" },
          
        ]
      },
    ]
  },

  {
    menu: "Pages",
    className: "has-mega-menu sub-menu-down",
    ulClassName: "mega-menu",
    extraImg: true,
    extraSpace : 'left-0 p-0 max-w-[1100px] max-xl:max-w-[990px] w-full mx-auto',
    submenu: [
      {
        child: "Pages",
        subchild: [
          { children: "About Us", to: "/about-us" },
          { children: "About Me", to: "/about-me" },
          { children: "Pricing Table", to: "/pricing-table" },
          { children: "Our Gift Vouchers", to: "/our-gift-vouchers" },
          { children: "What We Do", to: "/what-we-do" },
          { children: "Faqs 1", to: "/faqs-1" },
          { children: "Faqs 2", to: "/faqs-2" },
          { children: "Our Team", to: "/our-team" },
        ],
      },
      {
        child: "Contact Us",
        subchild: [
          { children: "Contact Us 1", to: "/contact-us-1" },
          { children: "Contact Us 2", to: "/contact-us-2" },
          { children: "Contact Us 3", to: "/contact-us-3" },          
        ],
      },
      {
        child: "Web Pages",
        subchild: [
          { children: "Error 404 1", to: "/error-1" },
          { children: "Error 404 2", to: "/error-2" },
          { children: "Coming Soon", to: "/coming-soon" },
          { children: "Under Construction", to: "/under-construction" },          
        ],
      },
      {
        child: "Banner Style",
        subchild: [
          { children: "Banner with BG Color", to: "/banner-with-bg-color" },
          { children: "Banner with Image", to: "/banner-with-image" },
          { children: "Banner with Video", to: "/banner-with-video" },
          { children: "Banner with Kanbern", to: "/banner-with-kanbern" },          
          { children: "Banner Small", to: "/banner-small" },          
          { children: "Banner Medium", to: "/banner-medium" },          
          { children: "Banner Large", to: "/banner-large" },          
        ],
      },
      {
        child: "Header Style",
        subchild: [
          { children: "Header Style 1", to: "/header-style-1" },
          { children: "Header Style 2", to: "/header-style-2" },
          { children: "Header Style 3", to: "/header-style-3" },
          { children: "Header Style 4", to: "/header-style-4" },
          { children: "Header Style 5", to: "/header-style-5" },
          { children: "Header Style 6", to: "/header-style-6" },
          { children: "Header Style 7", to: "/header-style-7" },
          { children: "Menu Styles", to: "/w3menu", extraClassli:"w3menulink" },               
        ],
      },
      {
        child: "Footer Style",
        subchild: [
          { children: "Footer Style 1", to: "/footer-style-1" },
          { children: "Footer Style 2", to: "/footer-style-2" },
          { children: "Footer Style 3", to: "/footer-style-3" },
          { children: "Footer Style 4", to: "/footer-style-4" },
          { children: "Footer Style 5", to: "/footer-style-5" },
          { children: "Footer Style 6", to: "/footer-style-6" },
          { children: "Footer Style 7", to: "/footer-style-7" },            
        ],
      },
      {
        child: "Dashboard",
        subchild: [
          { children: "Dashboard", to: "/account-dashboard" },       
          { children: "Orders", to: "/account-order" },       
          { children: "Orders Details", to: "/account-order-details" },       
          { children: "Orders Confirmation", to: "/account-order-confirmation" },       
          { children: "Downloads", to: "/account-downloads" },       
          { children: "Return Request", to: "/account-return-reques" },       
          { children: "Return Request Detail", to: "/account-return-request-detail" },       
          { children: "Return Request Confirmed", to: "/account-refund-requests-confirmed" },       
        ],
      },
    ],
  },
  {
    menu: "My Account",
    className: "sub-menu-down",
    ulClassName: "sub-menu",
    submenu: [
      {        
        subchild: [
          { children: "Dashboard", to: "/account-dashboard" },          
          { children: "Orders", to: "/account-orders" },          
          { children: "Orders Details", to: "/account-order-details" },          
          { children: "Orders Confirmation", to: "/account-order-confirmation" },          
          { children: "Downloads", to: "/account-downloads" },          
          { children: "Return Request", to: "/account-return-request" },          
          { children: "Return Request Detail", to: "/account-return-request-detail" },          
          { children: "Return Request Confirmed", to: "/account-refund-requests-confirmed" },          
          { children: "Profile", to: "/account-profile" },          
          { children: "Address", to: "/account-address" },          
          { children: "Shipping methods", to: "/account-shipping-methods" },          
          { children: "Payment Methods", to: "/account-payment-methods" },          
          { children: "Review", to: "/account-review" },          
          { children: "Billing address", to: "/account-billing-address" },          
          { children: "Shipping address", to: "/account-shipping-address" },          
          { children: "Cancellation Requests", to: "/account-cancellation-requests" },          
        ],
      },
    ],
  }
  // {
  //   menu: "Shop",
  //   className: "sub-menu-down",
  //   ulClassName: "sub-menu",
   
  //   submenu: [
  //     { child: "Shop Style 1", to: "/shop-style-1" },
  //     { child: "Shop Style 2", to: "/shop-style-2" },
  //     { child: "Shop Cart", to: "/shop-cart" },
  //     { child: "Shop Wishlist", to: "/shop-wishlist" },
  //     { child: "Shop Checkout", to: "/shop-checkout" },
  //     { child: "Product Detail", to: "/product-detail" },
  //   ],
  // },
  // {
  
  // { menu: "Contact Us", to: "/contact-us" },
];
