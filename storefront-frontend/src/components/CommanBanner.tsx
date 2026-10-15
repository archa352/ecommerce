import { StaticImageData } from "next/image";
import Link from "next/link";

interface texttype {
    image: string | StaticImageData,
    mainText : string
    parentText : string
    currentText : string
}

const CommanBanner = ({image,mainText,parentText,currentText} : texttype) => {
    return (
        <div className="dz-bnr-inr bg-secondary overlay-black-light" style={{backgroundImage:`url(${image})`}}>
            <div className="container">
                <div className="dz-bnr-inr-entry">
                    <h1>{mainText}</h1>
                    <nav className="breadcrumb-row">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="#"> {parentText}</Link></li>
                            <li className="breadcrumb-item">{currentText}</li>
                        </ul>
                    </nav>
                </div>
            </div>	
        </div>
    );
};

export default CommanBanner;