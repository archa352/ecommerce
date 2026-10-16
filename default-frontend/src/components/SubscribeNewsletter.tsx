"use client"
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubscribeNewsletter(){
   
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);    

    // Email validation function
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle form submission
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!isValidEmail(email)) {
            setMessage({ text: "Please enter a valid email address.", type: "error" });
            return;
        }
        setMessage(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));            
            toast.success("You have successfully subscribed!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            setEmail(""); // Clear input field            
        } catch (error) {
            setMessage({ text: "Something went wrong. Please try again.", type: "error" });
        } finally {
            // setLoading(false);
            {message}
        }
    };
    return(
        <form className="dzSubscribe style-1" onSubmit={handleSubscribe}>
            <ToastContainer />
            <div className="dzSubscribeMsg">                     
            </div>
            <div className="form-group" >
                <div className="input-group mb-0">
                    <input 
                        name="dzEmail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required type="email" className="form-control" placeholder="Your Email Address" 
                    />
                    <div className="input-group-addon">
                        <button name="submit" value="Submit" type="submit" className="btn">
                            <i className="icon feather icon-arrow-right" />
                        </button>
                    </div>
                    
                </div>
            </div>
        </form>
    )
}