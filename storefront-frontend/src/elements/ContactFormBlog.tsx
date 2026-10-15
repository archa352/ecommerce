"use client"
import { ToastContainer, toast } from "react-toastify";

const ContactFormBlog = () => {    
    const submitHandler = (e : any) => {
        e.preventDefault();    
        toast.success("You have successfully subscribed!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };
    return (
        <form className="dz-form dzForm" onSubmit={submitHandler}>
            <input type="hidden" className="form-control" name="dzToDo" value="Contact" />
            <input type="hidden" className="form-control" name="reCaptchaEnable" value="0" />
            <div className="dzFormMsg"></div>
            <label className="form-label">Your Name</label>
            <div className="input-group">
                <input required type="text" className="form-control" name="dzName" />
            </div>
            <label className="form-label">Email Address</label>
            <div className="input-group">
                <input required type="text" className="form-control" name="dzEmail" />
            </div>
            <label className="form-label">Phone Number</label>
            <div className="input-group">
                <input required type="text" className="form-control" name="dzPhoneNumber" />
            </div>
            <label className="form-label">Massage</label>
            <div className="input-group m-b30">
                <textarea name="dzMessage" rows={4} required className="form-control m-b10"></textarea>
            </div>
            
            <div>
                <button name="submit" type="submit" value="submit" className="btn w-100 btn-white btnhover">SUBMIT</button>
            </div>
            <ToastContainer />
        </form>
    );
};

export default ContactFormBlog;