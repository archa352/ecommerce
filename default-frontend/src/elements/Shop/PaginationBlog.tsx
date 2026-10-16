import Link from "next/link";

export default function PaginationBlog(){
    return(
        <>
            <li className="page-item"><Link href={"#"} className="page-link active">1</Link></li>
            <li className="page-item"><Link href={"#"} className="page-link">2</Link></li>
            <li className="page-item"><Link href={"#"} className="page-link">3</Link></li>
            <li className="page-item"><Link href={"#"} className="page-link next">Next</Link></li>
        </>
    )
}