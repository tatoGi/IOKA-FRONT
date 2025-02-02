import axios from "axios";


export const fetchSettingsData = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching settings data:", error);
    return null;
  }
};

export const settings = {
  submissionGeneralEmail: 1,
  facebookLink: 2,
  youtubeLink: 3,
  instagramLink: 4,
  linkdinLink: 5,
  footerLinkedin: 6,
  chatLink: 7,
  headerRedirectLinkGeneral: 8,
  HeaderButtonName: 9,
  googleMapsKey: 10,
  googleAnalyticsKey: 11,
  fileValidation: 12,
  officeIpAddress: 13,
  disableLang: 14, 
}