import { Metadata } from "next";
import HomePage from "./(home)/home/page";

export const metadata : Metadata = {
  title: "Zeen | Women's Ethnic & Casual Wear",
  description:
    "Zeen makes everyday and ethnic wear for women — churidars cut in considered fabrics with careful finishing and quiet modern ease.",
};

export default function Home() {
  return (
    <div >
      <main>
          <HomePage />  
      </main>    
    </div>
  );
}
