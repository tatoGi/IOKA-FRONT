import axios from "axios";


async function getDirectories(directoryType, page = 1) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/directory`, { params: { type_id: directoryType, page } });
        return response.data;
    } catch (error) {
        console.error("Error fetching directories:", error);
    }
}

export { getDirectories }
