import React from "react";
import Rental_ResaleComponent from "@/components/Rental_Resale/Rental_Resale";

const Rental_Resale_List = ({ cardData, currentPage, totalPages, isLoading, onPageChange }) => {
  return (
    <div>
      {/* Pass props to Rental_ResaleComponent */}
      <Rental_ResaleComponent
        cardData={cardData}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Rental_Resale_List;