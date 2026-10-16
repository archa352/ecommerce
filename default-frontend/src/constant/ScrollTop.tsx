import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface newType {
  x: number;
  y: number;
}
const ScrollTop = () => {
  const [position, setPosition] = useState<newType>({ x: 0, y: 0 });
  const  pathname  = usePathname();

  
  const cursorPosition = (ev: MouseEvent) => {
    setPosition({
      x: ev.clientX,
      y: ev.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", cursorPosition);

    return () => {
      window.removeEventListener("mousemove", cursorPosition);
    };
  }, []);

  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>

      <div
        id="pointer-ring"
        style={{
          borderColor: " rgb(117, 12, 126)",
          padding: "15px",          
          transform: `translate(${position.x - 15}px,${position.y - 15}px)`,
        }}
        className=""
      ></div>
      <div
        id="pointer-dot"
        style={{
          borderColor: "white",          
          transform: `translate(${position.x}px,${position.y}px)`,
        }}
      ></div>
    </>
  );
};

export default ScrollTop;
