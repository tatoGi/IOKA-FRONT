import React from "react";

const WhiteArrow = () => {
  return (
    <span>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_558_325)">
          <path
            d="M11.7062 7.70586C12.0968 7.31523 12.0968 6.68086 11.7062 6.29023L5.70615 0.290234C5.31553 -0.100391 4.68115 -0.100391 4.29053 0.290234C3.8999 0.680859 3.8999 1.31523 4.29053 1.70586L9.58428 6.99961L4.29365 12.2934C3.90303 12.684 3.90303 13.3184 4.29365 13.709C4.68428 14.0996 5.31865 14.0996 5.70928 13.709L11.7093 7.70898L11.7062 7.70586Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_558_325"
            x="-0.00244141"
            y="-0.00292969"
            width="16.0015"
            height="22.0049"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_558_325"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_558_325"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
};

export default WhiteArrow;
