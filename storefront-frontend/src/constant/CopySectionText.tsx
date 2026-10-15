"use client"

interface footerText{
    code : string;
}
export default function CopySectionText(props : footerText){
    function CopyText(){
        let changeText: HTMLElement | null = document.getElementById('copyButton');
        navigator.clipboard.writeText(props.code)
        changeText!.textContent = `Copied`
        changeText?.classList.add('active'); 
    }
    
    return(                                    
        <a  id="copyButton" className="btn" onClick={CopyText}>
            Copy
        </a>
    )
}