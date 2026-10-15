import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import CommanSidebar from "@/elements/MyAccount/CommanSidebar";
import { AccountProducts } from "@/constant/Alldata";
import Image from "next/image";

export default function AccountDownloads() {
    return (
        <>
            <div className="page-content bg-light">
                <CommanBanner image={IMAGES.BackBg1.src} mainText="Downloads" parentText="Home" currentText="Downloads" />
                <div className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            <CommanSidebar />
                            <section className="col-xl-9 account-wrapper">
                                <div className="account-card">
                                    <div className="table-responsive download-table">
                                        <table className="table check-tbl">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {AccountProducts.map((item, index)=>(
                                                    <tr key={index}>
                                                        <td className="product-item-price">{item.id}</td>
                                                        <td className="product-item-img"><Image src={item.image} alt="shirt" /></td>
                                                        <td className="product-item-name"><h6>{item.name}</h6></td>
                                                        <td><Link href={item.url} className="btn btn-md btn-outline-secondary btnhover20">Download</Link></td>
                                                    </tr>
                                                ))}                                           
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}