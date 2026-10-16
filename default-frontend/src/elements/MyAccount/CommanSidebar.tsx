import Link from "next/link";
import IMAGES from "../../constant/theme";
import Image from "next/image";

type MenuItem = {
    title: string;
    url: string;
  };
  
  const accountMenu: MenuItem[] = [
    { title: "Dashboard", url: "/account-dashboard" },
    { title: "Orders", url: "/account-orders" },
    { title: "Downloads", url: "/account-downloads" },
    { title: "Return request", url: "/account-return-request" },
  ];
  
  const accountSettingsMenu: MenuItem[] = [
    { title: "Profile", url: "/account-profile" },
    { title: "Address", url: "/account-address" },
    { title: "Shipping methods", url: "/account-shipping-methods" },
    { title: "Payment Methods", url: "/account-payment-methods" },
    { title: "Review", url: "/account-review" },
];

export default function CommanSidebar(){
    return(
        <aside className="col-xl-3">
            <div className="toggle-info">
                <h5 className="title mb-0">Account Navbar</h5>
                <a className="toggle-btn" href="#accountSidebar">Account Menu</a>
            </div>
            <div className="sticky-top account-sidebar-wrapper">
                <div className="account-sidebar" id="accountSidebar">
                    <div className="profile-head">
                        <div className="user-thumb">
                            <Image className="rounded-circle" src={IMAGES.ProfilePic} alt="Susan Gardner" />
                        </div>
                        <h5 className="title mb-0">Ronald M. Spino</h5>
                        <span className="text text-primary">info@example.com</span>
                    </div>
                    <div className="account-nav">
                        <div className="nav-title bg-light">DASHBOARD</div>
                        <ul>
                            {accountMenu.map((elem, index)=>(
                                <li key={index}><Link href={elem.url}>{elem.title}</Link></li>
                            ))}                            
                        </ul>
                        <div className="nav-title bg-light">ACCOUNT SETTINGS</div>
                        <ul className="account-info-list">
                            {accountSettingsMenu.map((elem, ind)=>(
                                <li key={ind}><Link href={elem.url}>{elem.title}</Link></li>
                            ))}                            
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
} 