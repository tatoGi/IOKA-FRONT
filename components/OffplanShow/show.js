import React from "react";
import { useRouter } from "next/router";
import style from "./OffplaneShow.module.css";
import Image from "next/image";
import bannerimage from "../../assets/img/fifth-tower.png";
import qrimage from "../../assets/img/qr.png";
import buildingImage from "../../assets/img/building.png";
import dynamic from "next/dynamic";

// Create a separate Map component to handle client-side rendering
const Map = dynamic(
  () => import("./Map"), // Create a new Map.js component
  { ssr: false }
);

const OffplanShow = () => {
  const router = useRouter();
  const { id } = router.query;

  const position = [25.2048, 55.2708]; // Dubai coordinates
  const features = [
    "36-storey residential tower with 345 units",
    "Studios starting from 390 Sq.Ft to 420 Sq.Ft",
    "1-bedroom apartments from 650 Sq.Ft to 670 Sq.Ft",
    "2-bedroom apartments measuring 1,012 to 1,130 square feet",
    "Strategic location with easy access to major Dubai attractions"
  ];

  const amenities = [
    "Community Swimming Pool",
    "Landscaped Court",
    "Children's Area",
    "Restaurants",
    "Gymnasium",
    "Tennis Court",
    "Supermarket",
    "Golf Club"
  ];

  const nearbyPlaces = [
    { name: "Dubai Hills Mall", distance: "7m", coords: [25.2048, 55.2718] },
    { name: "Dubai Autodrome", distance: "10m", coords: [25.2058, 55.2728] },
    { name: "Burj Khalifa", distance: "15m", coords: [25.2068, 55.2738] },
    { name: "The Dubai Mall", distance: "15m", coords: [25.2078, 55.2748] },
    { name: "Jumeirah Beach", distance: "20m", coords: [25.2088, 55.2758] },
    { name: "Dubai World Center", distance: "28m", coords: [25.2098, 55.2768] }
  ];

  return (
    <>
      <div className={`container ${style.offplanebanner}`}>
        <Image
          src={bannerimage}
          alt="The Fifth Tower at JVC"
          fill
          priority
          sizes="100vw"
          className={style.bannerImage}
        />
        <div className={style.bannerContent}>
          <h1>THE FIFTH TOWER AT JVC</h1>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className={style.propertyDetails}>
              <h2>Off-Plan property launched by Object 1 Development</h2>
              <div className={style.pricing}>
                <span className={style.aedPrice}>
                  Starting Price: AED 554,000
                </span>
                <span className={style.usdPrice}>USD 150,832</span>
              </div>
              <div className={style.description}>
                <p>
                  The Fifth Tower is a stunning 36-storey residential
                  development in Jumeirah Village Circle (JVC), crafted by
                  Object 1 Development. This architectural marvel features 345
                  thoughtfully designed units, ranging from compact studios to
                  spacious 1- and 2- bedroom apartments. Each residence is
                  finished to the highest standards, boasting a neutral color
                  palette and spacious layouts that maximize comfort. The
                  tower's eye- catching façade promises to be a new landmark in
                  the area, seamlessly blending...
                </p>
                <button className={style.readMore}>Read more</button>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className={style.qrCard}>
              <h3>Modern Living in Jumeirah Village Circle</h3>
              <Image
                src={qrimage}
                alt="QR Code"
                width={180}
                height={180}
                style={{ margin: "0 auto" }}
              />
              <p>
                The Fifth Tower offers elegant living space in a prime location,
                combining modernity with convenience in the heart of Jumeirah
                Village Circle.
              </p>
              <div className={style.qrButtons}>
                <button className={style.downloadBtn}>Download Brochure</button>
                <button className={style.enquireBtn}>Enquire now</button>
              </div>
            </div>
          </div>
        </div>

        <div className={style.buildingSection}>
          <div className="row">
            <div className="col-md-6">
              <Image
                src={buildingImage}
                alt="The Fifth Tower Building"
                width={600}
                height={400}
                className={style.buildingImage}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="col-md-6">
              <div className={style.featuresSection}>
                <h3>Features</h3>
                <ul className={style.featuresList}>
                  {[
                    "36-storey residential tower with 345 units",
                    "Spacious studio units ranging from 380 to 624 square feet",
                    "1-bedroom apartments sized from 844 to 1,375 square feet",
                    "2-bedroom apartments measuring 1,112 to 1,113 square feet",
                    "Strategic location with easy access to major Dubai attractions"
                  ].map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className={style.amenitiesSection}>
                <h3>Amenities</h3>
                <div className={style.amenitiesList}>
                  <div className={style.amenityItem}>
                    Community Swimming Pool
                  </div>
                  <div className={style.amenityItem}>Gymnasium</div>
                  <div className={style.amenityItem}>Tennis Court</div>
                  <div className={style.amenityItem}>Basketball Court</div>
                  <div className={style.amenityItem}>Children's Area</div>
                  <div className={style.amenityItem}>Supermarkets</div>
                  <div className={style.amenityItem}>Restaurants</div>
                  <div className={style.amenityItem}>Golf Club</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.locationSection}>
          <h3>Location</h3>
          <div className={style.mapWrapper}>
            <div className={style.mapContainer}>
              <Map position={position} nearbyPlaces={nearbyPlaces} />
            </div>
            <button className={style.locationMapBtn}>Location Map</button>
          </div>

          <h4>Near by</h4>
          <div className={style.nearbyGrid}>
            <div className={style.nearbyColumn}>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>Dubai Hills Mall</span>
                <span className={style.placeDistance}>7m</span>
              </div>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>Dubai Autodrome</span>
                <span className={style.placeDistance}>10m</span>
              </div>
            </div>
            <div className={style.nearbyColumn}>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>Burj Khalifa</span>
                <span className={style.placeDistance}>15m</span>
              </div>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>The Dubai Mall</span>
                <span className={style.placeDistance}>15m</span>
              </div>
            </div>
            <div className={style.nearbyColumn}>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>Jumeirah Beach</span>
                <span className={style.placeDistance}>20m</span>
              </div>
              <div className={style.nearbyPlace}>
                <span className={style.placeName}>Dubai World Center</span>
                <span className={style.placeDistance}>28m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffplanShow;
