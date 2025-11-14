
import { useEffect, useRef } from "react";

const useHorizontalScroll = () => {
  const elRef = useRef();

  useEffect(() => {
    const el = elRef.current;
    if (el) {
      let isDown = false;
      let startX;
      let scrollLeft;

      const onMouseDown = (e) => {
        isDown = true;
        el.classList.add("active");
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      };

      const onMouseLeave = () => {
        isDown = false;
        el.classList.remove("active");
      };

      const onMouseUp = () => {
        isDown = false;
        el.classList.remove("active");
      };

      const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2; //scroll-fast
        el.scrollLeft = scrollLeft - walk;
      };

      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY < 0 ? -300 : 300,
          behavior: "smooth",
        });
      };

      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("wheel", onWheel);

      return () => {
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("wheel", onWheel);
      };
    }
  }, []);

  return elRef;
}

export default useHorizontalScroll;