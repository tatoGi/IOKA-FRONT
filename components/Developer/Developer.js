import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPhone, FaWhatsapp, FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import { DEVELOPER_API } from "@/routes/apiRoutes";
import styles from "./Developer.module.css";
import defaultImage from "../../assets/img/default.webp"; // ✅ Correct import
import { LoadingWrapper } from "../LoadingWrapper/index"; // Import LoadingWrapper

const Developer = ({ initialData, initialPagination }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
   const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
    const [totalPages, setTotalPages] = useState(initialPagination?.last_page || 1);
  const [imageIndexes, setImageIndexes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  // Fetch data for the selected page
  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DEVELOPER_API}?page=${page}`);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setFilteredData(Array.isArray(data) ? data : [data]);
      setTotalPages(response.data.last_page); // Set total pages from API response
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts or when currentPage changes
  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchData(page); // Fetch data for the new page
    }
  };

  // Fetch data when the component mounts (if no initialData is provided)
  useEffect(() => {
    if (!initialData) {
      fetchData(currentPage);
    }
  }, [currentPage, initialData]);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = cardData.filter((card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(cardData);
    }
  }, [searchQuery, cardData]);

 

  // Handle "Read More" button click
  const handleReadMore = (slug) => {
    router.push(`/developer/${slug}`);
  };

  // Get image URL for a card
  const getImageUrl = (photoJson, cardId) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const currentIndex = imageIndexes[cardId] || 0;
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeURIComponent(parsed[currentIndex].file)}`;
      }
      return defaultImage;
    } catch (e) {
      return defaultImage;
    }
  };

  // Handle next image button click
  const handleNextImage = (cardId, photoJson) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) + 1) % parsed.length,
        }));
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  // Handle previous image button click
  const handlePrevImage = (cardId, photoJson) => {
    try {
      const parsed = JSON.parse(photoJson);
      if (Array.isArray(parsed)) {
        setImageIndexes((prev) => ({
          ...prev,
          [cardId]: ((prev[cardId] || 0) - 1 + parsed.length) % parsed.length,
        }));
      }
    } catch (e) {
      console.error("Error navigating images:", e);
    }
  };

  if (!filteredData || filteredData.length === 0) {
    return <div className="text-center py-5">No developers found</div>;
  }

  return (
    <div className="container py-4">
      {/* Search Section */}
      <div className={`mb-4 position-relative ${styles.searchContainer}`}>
        <input
          type="text"
          placeholder="City, Building or community"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control ps-5"
        />
        <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
      </div>
      <LoadingWrapper isLoading={isLoading}></LoadingWrapper>
      {/* Developer Cards */}
      <div className="row">
        {filteredData.map((card) => (
          <div key={card.id} className="col-md-6 mb-4">
            <div className={`card h-100 shadow-sm ${styles.card}`}>
              <div className="row g-0 h-100">
                {/* Image Section */}
                <div className="col-md-6 position-relative">
                  <Image
                    src={getImageUrl(card.photo, card.id)}
                    alt={card.title}
                    width={400}
                    height={300}
                    className="img-fluid h-100"
                    style={{ objectFit: "cover" }}
                  />
                  {JSON.parse(card.photo)?.length > 1 && (
                    <div className="position-absolute top-50 start-0 end-0 d-flex justify-content-between px-3">
                      <button
                        onClick={() => handlePrevImage(card.id, card.photo)}
                        className={`btn btn-light rounded-circle ${styles.prevButtonimage}`}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => handleNextImage(card.id, card.photo)}
                        className={`btn btn-light rounded-circle ${styles.nextButtonimage}`}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="col-md-6 d-flex flex-column p-3">
                  <h2 className={`h4 ${styles.title}`}>{card.title}</h2>
                  <div className={`flex-grow-1 ${styles.description}`}>
                    <div dangerouslySetInnerHTML={{ __html: card.paragraph }} />
                  </div>
                  <div className="mt-3">
                    <h3 className={`h6 ${styles.communities}`}>Top Communities</h3>
                    <div className="d-flex flex-wrap gap-2">
                      {JSON.parse(card.tags).map((tag, index) => (
                        <span key={index} className={`bg-light text-dark border ${styles.badge}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3 align-items-center">
                    <button className={`btn btn-primary d-flex align-items-center gap-2 ${styles.call}`}>
                      <FaPhone />
                      <span>Call</span>
                    </button>
                    <button className={`btn btn-success d-flex align-items-center gap-2 ${styles.whatsapp}`}>
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      className={styles.readMore}
                      onClick={() => handleReadMore(card.slug)}
                    >
                      See More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={`d-flex justify-content-center mt-4 ${styles.pagination}`}>
        {/* Previous Button */}
        <button
          className={`btn btn-outline-primary me-2 ${styles.prevButton}`}
          disabled={currentPage === 1 || isLoading}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaChevronLeft />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`btn btn-outline-primary mx-1 ${styles.pageButton} ${
              currentPage === page ? styles.active : ""
            }`}
            disabled={isLoading}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          className={`btn btn-outline-primary ms-2 ${styles.nextButton}`}
          disabled={currentPage === totalPages || isLoading}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Developer;