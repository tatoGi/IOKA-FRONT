import axios from "axios";


async function Submission(data) { 
      const response = await axios.postForm(`${process.env.NEXT_PUBLIC_SERVER_URL}/submission`, data );
      return response.data; 
  }


  async function verifivationCode(email) { 
    const response = await axios.postForm(`${process.env.NEXT_PUBLIC_SERVER_URL}/send-verification-code?email=${email}`);
    return response.data; 
}

async function booking_service(data) { 
  const response = await axios.postForm(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking-service`, data );
  return response.data; 
}

  export {Submission, verifivationCode, booking_service}
