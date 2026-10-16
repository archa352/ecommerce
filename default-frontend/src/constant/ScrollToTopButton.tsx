"use client"
import { useEffect, useState } from "react";

const ScrollToTopButton = () =>{
    const [isVisible, setIsVisible] = useState<boolean>(false);

  // Show button after scrolling down
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 1000);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Scroll smoothly to top
    const scrollToTop = (): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return(
        <button className="scroltop" type="button"
            style={{
                display: "inline-block",
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: isVisible ? 'auto' : 'none',
            }} 
            onClick={scrollToTop}
        >
            <i className="fas fa-arrow-up" />
        </button>
    )
}
export default ScrollToTopButton;