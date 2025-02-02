import axios from "axios";

export const getTranslations = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getTranslations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching translations:", error);
        return null;
    }
}