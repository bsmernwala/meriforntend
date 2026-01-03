

import React, { useState, useEffect, useRef } from "react";
import "./custom.slider.css";

function CustomCarousel({ children, interval = 5000 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("right"); // "right" or "left"
  const timeoutRef = useRef(null);

  const slideNext = () => {
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % children.length);
  };

  const slidePrev = () => {
    setDirection("left");
    setActiveIndex((prev) =>
      prev === 0 ? children.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex]);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(slideNext, interval);
  };

  const handleMouseEnter = () => clearTimeout(timeoutRef.current);
  const handleMouseLeave = () => resetTimer();

  return (
    <div
      className="container__slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="slider-track"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: `transform 0.6s ease-in-out`,
        }}
      >
        {children.map((item, index) => (
          <div className="slider__item" key={index}>
            {item}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="container__slider__links">
        {children.map((_, index) => (
          <button
            key={index}
            className={`container__slider__links-small ${
              activeIndex === index ? "container__slider__links-small-active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <button className="slider__btn-next" onClick={slideNext}>
        {">"}
      </button>
      <button className="slider__btn-prev" onClick={slidePrev}>
        {"<"}
      </button>
    </div>
  );
}

export default CustomCarousel;
