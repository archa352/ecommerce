import Link from "next/link";

export default function PostTag(){
    return(
        <div className="post-tags">
            <strong>Tags:</strong>
            <Link href={"#"}>Dresses</Link>{" "}
            <Link href={"#"}>Boots</Link>{" "}
            <Link href={"#"}>Jewelry</Link>{" "}
            <Link href={"#"}>Jacket</Link>{" "}
            <Link href={"#"}>Coat</Link>{" "}
        </div>
    )
}