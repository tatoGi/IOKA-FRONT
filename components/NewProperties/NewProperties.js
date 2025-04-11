import React, { useState } from "react";
import styles from "./NewProperties.module.css";
import Image from "next/image";

const NewProperties = ({ sectionDataThree }) => {
const [activeTab, setActiveTab] = useState("offplan");

const handleTabClick = (tab) => {
setActiveTab(tab);
};

if (!sectionDataThree || !sectionDataThree.additional_fields) {
return <div>Data not available</div>;
}

const activeData = sectionDataThree.additional_fields.tabs[activeTab];
const decodeImageUrl = (url) => {
return decodeURIComponent(url);
};
const isMobile = typeof window !== "undefined" && window.innerWidth <= 768; return ( <section
    className={styles.newProperties}>
    <div className={`container ${styles.container}`}>
        {/* Mobile title */}
        <div className={styles.mobileTitle}>
            <h2>{sectionDataThree.title}</h2>
        </div>
        {/* Desktop title */}
        <div className={styles.propertyCard}>
            {/* {Mobile Button} */}
            <div className={styles.filterButtons_mobile}>
                <div className={styles.buttonGroup}>
                    <button className={activeTab === "offplan" ? styles.active : "" } onClick={()=>
                        handleTabClick("offplan")}
                        >
                        OFF PLAN
                    </button>
                    <button className={activeTab === "resale" ? styles.active : "" } onClick={()=>
                        handleTabClick("resale")}
                        >
                        RESALE
                    </button>
                    <button className={activeTab === "rental" ? styles.active : "" } onClick={()=>
                        handleTabClick("rental")}
                        >
                        RENTAL
                    </button>
                </div>
            </div>
            {/* {end mobile button} */}
            <div className={styles.propertyCardTitle}>
                {sectionDataThree.title}
                <div className={styles.filterButtons}>
                    <div className={styles.buttonGroup}>
                        <button className={activeTab === "offplan" ? styles.active : "" } onClick={()=>
                            handleTabClick("offplan")}
                            >
                            OFF PLAN
                        </button>
                        <button className={activeTab === "resale" ? styles.active : "" } onClick={()=>
                            handleTabClick("resale")}
                            >
                            RESALE
                        </button>
                        <button className={activeTab === "rental" ? styles.active : "" } onClick={()=>
                            handleTabClick("rental")}
                            >
                            RENTAL
                        </button>
                    </div>
                </div>
            </div>

            {activeData && (
            <>
                <div className={styles.propertyContent}>
                    <div className={styles.imageContainer}>
                        <Image src={ activeData.image_field ? `${ process.env.NEXT_PUBLIC_API_URL
                            }/storage/${decodeImageUrl(activeData.image_field)}` : homeBanner }
                            alt={activeData.title_one} width={1200} height={600} className={styles.propertyImage}
                            priority />
                    </div>

                    <div className={styles.propertyInfo}>
                        <ul className={styles.features}>
                            {activeData.properties.map((property, index) => (
                            <li key={index}>{property.title}</li>
                            ))}
                        </ul>

                    </div>

                </div>

                <div className={styles.propertyDetails}>
                    <div className={styles.leftContent}>
                        <h3 className={styles.propertyName}>{activeData.title_one}</h3>
                        <p className={styles.propertyType}>{activeData.title_two}</p>
                        <p className={styles.price}>
                            {activeData.number} {activeData.number_suffix}
                        </p>
                       
                    </div>

                    <div className={styles.rightContent}>
                        <a href={activeData.url} className={styles.seeMore}>
                            SEE MORE
                        </a>
                    </div>
                </div>
                {isMobile && (
                        <div className={styles.propertyInfo_mobile}>
                            <details>
                                <summary>Key Highlights</summary>
                                <ul className={styles.features_mobile}>
                                    {activeData.properties.map((property, index) => (
                                    <li key={index}>{property.title}</li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                )}
            </>
            )}
        </div>
    </div>
    </section>
    );
    };

    export default NewProperties;
