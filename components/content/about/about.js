import React, { useState, useEffect } from "react";
import AboutUs from "@/components/AboutUs/AboutUs";
const About = () => {
  const [isScrollable, setIsScrollable] = useState(false);

  return (
    <div>
      <AboutUs />
    </div> 
  );
};

export default About;
