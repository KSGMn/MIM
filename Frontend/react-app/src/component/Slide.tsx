import React, { useEffect, useRef, useState } from "react";
import "../styles/Slide.css";
import { Carousel } from "react-responsive-carousel";
import { Settings } from "react-slick";

type Image = {
  label: string;
  alt: string;
  url: string;
};

interface Props {
  images: string;
}

const Slide: React.FC<Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images) {
    console.log("데이터 있음");
  }

  // const goToPrevious = () => {
  //   setCurrentIndex(
  //     (prevIndex) => (prevIndex - 1 + images.length) % images.length
  //   );
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  return (
    <div className="slider-container">
      {/* {images?.length >= 1 && (
        <button className="slider-button left" onClick={goToPrevious}>
          &#10094;
        </button>
      )} */}
      {/* {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`slide ${index === currentIndex ? "active" : ""}`}
        />
      ))} */}

      {images ? <img src={images} className="active" /> : null}

      {/* {images?.length >= 1 && (
        <button className="slider-button right" onClick={goToNext}>
          &#10095;
        </button>
      )} */}
    </div>
  );
};

export default Slide;
