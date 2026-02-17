import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";


gsap.registerPlugin(Draggable);

const Hang = () => {
  const emojiRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const ropeLength = 200;
    const gravity = 0.003;
    const damping = 0.995;

    const anchor = {
      x: window.innerWidth - 80,
      y: 0,
    };

    let angle = 0;
    let angularVelocity = 0;
    let isDragging = false;

    // --- Update rope path ---
    const drawRope = (x, y) => {
      gsap.set(pathRef.current, {
        attr: {
          d: `M ${anchor.x} ${anchor.y} 
              Q ${(anchor.x + x) / 2} ${(anchor.y + y) / 2}
              ${x} ${y}`,
        },
      });
    };

    // --- Update emoji position based on angle ---
    const updateFromAngle = () => {
      const x = anchor.x + ropeLength * Math.sin(angle);
      const y = anchor.y + ropeLength * Math.cos(angle);

      gsap.set(emojiRef.current, {
        x: x - 35,
        y: y - 35,
        rotation: (angle * 180) / Math.PI,
      });

      drawRope(x, y);
    };

    // --- Physics loop ---
    const tick = () => {
      if (!isDragging) {
        const acceleration = -gravity * Math.sin(angle);
        angularVelocity += acceleration;
        angularVelocity *= damping;
        angle += angularVelocity;

        updateFromAngle();
      }
    };

    gsap.ticker.add(tick);

    // Initial vertical position
    angle = 0;
    updateFromAngle();

    // --- Draggable ---
    Draggable.create(emojiRef.current, {
      type: "x,y",

      onPress() {
        isDragging = true;
        angularVelocity = 0;
      },

      onDrag() {
        const x = this.x + 35;
        const y = this.y + 35;

        angle = Math.atan2(x - anchor.x, y - anchor.y);
        drawRope(x, y);
      },

      onRelease() {
        isDragging = false;
        angularVelocity = this.getVelocity("x") * 0.002;
      },
    });

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <svg
        width="100%"
        height="400"
        className="absolute top-0 left-0 pointer-events-none"
      >
        <path
          ref={pathRef}
          stroke="#4af1ff"
          strokeWidth="2"
          fill="transparent"
        />
      </svg>

      <div
        ref={emojiRef}
        className="absolute text-7xl cursor-grab select-none"
      >
        🎭
      </div>
    </div>
  );
};

export default Hang;
