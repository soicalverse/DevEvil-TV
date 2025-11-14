import { useEffect } from 'react';

const useHorizontalScroll = (ref) => {
  useEffect(() => {
    const element = ref.current;
    if (element) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      };
      element.addEventListener('wheel', onWheel);
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, [ref]);
};

export default useHorizontalScroll;
