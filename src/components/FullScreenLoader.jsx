import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect } from "react";
const FullScreenLoader = ({ isLoading }) => {
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (latest) =>
    Math.floor(latest)
  );

  const clipPath = useTransform(
    progress,
    [0, 100],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  useEffect(() => {
    if (isLoading) {
      progress.set(0);

      const controls = animate(progress, 100, {
        duration: 1.5,
        ease: "easeInOut",
      });

      return controls.stop;
    }
  }, [isLoading, progress]);

  useEffect(() => {
    if (isLoading) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      const y = parseInt(scrollY || "0", 10);

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      window.scrollTo(0, -y);
    }
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-999 flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="relative w-full flex items-center justify-center">
            <motion.h1
              className="text-[16vw] font-black text-neutral-800 select-none leading-none"
              animate={{ scale: 5, opacity: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Freshers
            </motion.h1>

            <motion.h1
              className="absolute text-[16vw] font-black text-white select-none leading-none"
              animate={{ scale: 5, opacity: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ clipPath }}
            >
              Freshers
            </motion.h1>
          </div>

          <motion.div
            className="absolute bottom-10 right-10 text-white font-semibold text-lg tracking-wide"
            animate={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Loading... <motion.span>{rounded}</motion.span>%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default FullScreenLoader;
