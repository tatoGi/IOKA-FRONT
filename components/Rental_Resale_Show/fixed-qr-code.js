{/* QR Code */}
<Image
  src={
    RENTAL_RESALE_DATA.qr_photo
      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${RENTAL_RESALE_DATA.qr_photo}`
      : "/default.jpg"
  }
  alt="QR Code"
  width={120}
  height={120}
  className={styles.qrCode}
/>
