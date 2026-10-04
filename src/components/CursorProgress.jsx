import React, { useEffect, useRef } from "react";

export default function CursorProgress({ pointerRef }) {
  const curRef = useRef(null);
  const progRef = useRef(null);

  useEffect(() => {
    let animId;
    const cur = curRef.current;
    const prog = progRef.current;

    const handlePointerMove = (e) => {
      if (pointerRef?.current) {
        pointerRef.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.my = (e.clientY / window.innerHeight) * 2 - 1;
        pointerRef.current.cx = e.clientX;
        pointerRef.current.cy = e.clientY;
      }
      if (cur) {
        cur.style.opacity = "1";
      }
    };

    const handlePointerLeave = () => {
      if (cur) cur.style.opacity = "0";
    };

    const handlePointerEnterInteractive = () => {
      if (cur) {
        cur.style.width = "78px";
        cur.style.height = "78px";
        cur.style.margin = "-39px 0 0 -39px";
        cur.style.backgroundColor = "rgba(255, 92, 138, 0.16)";
      }
    };

    const handlePointerLeaveInteractive = () => {
      if (cur) {
        cur.style.width = "40px";
        cur.style.height = "40px";
        cur.style.margin = "-20px 0 0 -20px";
        cur.style.backgroundColor = "transparent";
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    const updateInteractiveListeners = () => {
      const interactiveEls = document.querySelectorAll(
        "a, button, [data-magnetic]",
      );
      interactiveEls.forEach((el) => {
        el.addEventListener("pointerenter", handlePointerEnterInteractive);
        el.addEventListener("pointerleave", handlePointerLeaveInteractive);
      });
    };
    updateInteractiveListeners();

    // Loop for smooth cursor following & scroll progress
    const loop = () => {
      animId = requestAnimationFrame(loop);

      if (pointerRef?.current && cur) {
        const p = pointerRef.current;
        p.cxs += (p.cx - p.cxs) * 0.2;
        p.cys += (p.cy - p.cys) * 0.2;
        p.mxs += (p.mx - p.mxs) * 0.06;
        p.mys += (p.my - p.mys) * 0.06;
        cur.style.transform = `translate3d(${p.cxs.toFixed(1)}px, ${p.cys.toFixed(1)}px, 0)`;
      }

      if (prog) {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
        prog.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, [pointerRef]);

  return (
    <>
      {/* Top progress bar */}
      <div
        ref={progRef}
        id="progress"
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-[3px] z-50 origin-left scale-x-0 bg-gradient-to-r from-pink via-yellow to-cyan transition-transform duration-75 pointer-events-none"
      />

      {/* Custom follower cursor */}
      <div
        ref={curRef}
        id="cur"
        aria-hidden="true"
        className="fixed top-0 left-0 w-[40px] h-[40px] -mt-[20px] -ml-[20px] rounded-full border-[1.5px] border-pink pointer-events-none z-50 opacity-0 transition-[opacity,width,height,margin,background-color] duration-300 hidden md:block"
      />
    </>
  );
}
