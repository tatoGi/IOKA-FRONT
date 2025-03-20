import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Container, Row, Col, Button, Form, Stack } from "react-bootstrap"; // Import React Bootstrap components
import {
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaWhatsapp,
  FaSearch
} from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import { DEVELOPER_API } from "@/routes/apiRoutes";
import styles from "./Developer.module.css";
import defaultImage from "../../assets/img/default.webp";
import { LoadingWrapper } from "../LoadingWrapper/index";
import SubscribeSection from "../SubscribeSection/SubscribeSection";

const Developer = ({ initialData, initialPagination }) => {
  const [cardData, setCardData] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(
    initialPagination?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(
    initialPagination?.last_page || 1
  );
  const [imageIndexes, setImageIndexes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch data for the selected page
  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${DEVELOPER_API}?page=${page}`);
      const data = response.data.data;
      setCardData(Array.isArray(data) ? data : [data]);
      setFilteredData(Array.isArray(data) ? data : [data]);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  const limitTextLength = (text, maxLength) => {
    const strippedText = text.replace(/(<([^>]+)>)/gi, "");
    return strippedText.length > maxLength
      ? strippedText.substring(0, maxLength) + "..."
      : strippedText;
  };

  // Fetch data when the component mounts
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
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodeURIComponent(
          parsed[currentIndex].file
        )}`;
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
          [cardId]: ((prev[cardId] || 0) + 1) % parsed.length
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
          [cardId]: ((prev[cardId] || 0) - 1 + parsed.length) % parsed.length
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
    <LoadingWrapper isLoading={isLoading}>
      <Container fluid className="py-4">
        {/* Search Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="position-relative">
              <Form.Control
                type="text"
                placeholder="City, Building or community"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-5"
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
            </Form.Group>
          </Col>
        </Row>

        {/* Developer Cards */}
        <Row>
          {filteredData.map((card) => (
            <Col key={card.id} md={6} className="mb-4">
              <div className={`card h-100 shadow-sm ${styles.card}`}>
                <Row className="g-0 h-100">
                  {/* Image Section */}
                  <Col md={6} className="position-relative">
                    <Image
                      src={getImageUrl(card.photo, card.id)}
                      alt={card.title}
                      width={400}
                      height={300}
                      className="img-fluid h-100"
                      style={{ objectFit: "cover" }}
                    />
                    {JSON.parse(card.photo)?.length > 1 && (
                      <Stack
                        direction="horizontal"
                        className="position-absolute top-50 start-0 end-0 justify-content-between px-3"
                      >
                        <Button
                          onClick={() => handlePrevImage(card.id, card.photo)}
                          className={`rounded-circle ${styles.prevButtonimage}`}
                        >
                          <FaChevronLeft />
                        </Button>
                        <Button
                          onClick={() => handleNextImage(card.id, card.photo)}
                          className={`rounded-circle ${styles.nextButtonimage}`}
                        >
                          <FaChevronRight />
                        </Button>
                      </Stack>
                    )}
                  </Col>

                  {/* Content Section */}
                  <Col md={6} className="d-flex flex-column ">
                    <h2 className={`h4 ${styles.title}`}>{card.title}</h2>
                    <div className={`flex-grow-1 ${styles.description}`}>
                      <p>{limitTextLength(card.paragraph, 108)}</p>
                    </div>
                    <div className="mt-3">
                      <h3 className={`h6 ${styles.communities}`}>
                        Top Communities
                      </h3>
                      <Stack
                        direction="horizontal"
                        gap={2}
                        className="flex-wrap"
                      >
                        {JSON.parse(card.tags).map((tag, index) => (
                          <span
                            key={index}
                            className={`bg-light text-dark  ${styles.badge}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </Stack>
                    </div>
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="mt-3 align-items-center justify-content-between mb-4" // Added mb-4 here
                    >
                      {/* Call and WhatsApp Buttons */}
                      <Stack direction="horizontal" gap={2}>
                        <Button
                          variant="primary"
                          className={`d-flex align-items-center gap-2 ${styles.call}`}
                          onClick={() =>
                            (window.location.href = `tel:${card.phone}`)
                          }
                        >
                          <FaPhone />
                          <span>Call</span>
                        </Button>
                        <Button
                          variant="success"
                          className={`d-flex align-items-center gap-2 ${styles.whatsapp}`}
                          onClick={() =>
                            window.open(
                              `https://wa.me/${card.whatsapp}`,
                              "_blank"
                            )
                          }
                        >
                          <FaWhatsapp />
                          <span>WhatsApp</span>
                        </Button>
                      </Stack>

                      {/* See More Button */}
                      <Button
                        variant="link"
                        className={styles.readMore}
                        onClick={() => handleReadMore(card.slug)}
                      >
                        See More
                      </Button>
                    </Stack>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Stack direction="horizontal" gap={2}>
              <Button
                variant="outline-primary"
                disabled={currentPage === 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FaChevronLeft />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      currentPage === page ? "primary" : "outline-primary"
                    }
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FaChevronRight />
              </Button>
            </Stack>
          </Col>
        </Row>

        <SubscribeSection />
      </Container>
    </LoadingWrapper>
  );
};

export default Developer;
