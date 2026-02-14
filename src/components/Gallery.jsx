import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { gsap } from "gsap";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const trackRef = useRef(null);
  const animationRef = useRef(null);

  // 🔥 Fetch images from Firestore
  useEffect(() => {
    const galleryQuery = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      galleryQuery,
      (snapshot) => {
        const imagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imagesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching gallery:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔥 Wait until all images are fully loaded
  useEffect(() => {
    if (!trackRef.current || images.length === 0) return;

    const imgElements = trackRef.current.querySelectorAll("img");
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === imgElements.length) {
        setImagesLoaded(true);
      }
    };

    imgElements.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
      }
    });

    return () => {
      imgElements.forEach((img) => {
        img.removeEventListener("load", checkAllLoaded);
      });
    };
  }, [images]);

  // 🔥 Infinite animation (runs ONLY after images fully load)
  useLayoutEffect(() => {
    if (!imagesLoaded || !trackRef.current) return;

    const track = trackRef.current;

    // Kill previous animation if exists
    if (animationRef.current) {
      animationRef.current.kill();
    }

    gsap.set(track, { x: 0 });
    const isMobile = window.innerWidth < 768;

    const totalWidth = track.scrollWidth / 2;

    animationRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: isMobile ? 40 : 20,
      ease: "none",
      repeat: -1,
      force3D: true,
    });

    const pause = () => animationRef.current.pause();
    const play = () => animationRef.current.play();

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);

    return () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", play);
      }
      animationRef.current?.kill();
    };
  }, [imagesLoaded]);

  if (loading) {
    return (
      <section className="py-24 text-white text-center">
        <p>Loading gallery...</p>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-24  text-white text-center">
        <p>No photos in gallery yet</p>
      </section>
    );
  }

  // Duplicate images for seamless infinite loop
  const loopImages = [...images, ...images];

  return (
    <section id="gallery" className="relative py-24 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Endless Memories 📸
        </h2>
        <p className="text-slate-400 mt-4">
          Some moments never stop replaying
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 w-max will-change-transform"
        >
          {loopImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative group  rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.alt || "Gallery image"}
                loading="lazy"
                className=" w-auto h-50 md:h-100 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                <h4 className="text-white text-xl font-semibold">
                  {image.alt || "Party🎉"}
                </h4>
                <p className="text-slate-300 text-sm">
                  {image.category}
                </p>
              </div>

              {/* Soft border glow */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition"></div>
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-black to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-r from-black to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Gallery;
