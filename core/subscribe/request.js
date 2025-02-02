import axios from "axios";


async function getSubscribeTopics() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getTopics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching directories:", error);
    }
}

async function Subscribe(data) { 
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/subscribe`, data );
    return response.data; 
}

export { getSubscribeTopics, Subscribe }