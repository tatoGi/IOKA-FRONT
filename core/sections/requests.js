import axios from "axios";


async function getMenus() {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/sections`);
  const sections = response.data.data;
  const menu = {
    1: "header",
    2: "footer",
    3: "Upper Header",
  };
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    slug: section?.slugs?.find((s) => s.locale === section?.translation?.locale)?.slug,
    menu_types: section?.menu_types?.map((x) => menu[x?.id]),
    parent_id: section.parent_id,
    sort: section.sort,
    type_id: section.type_id
  }))
}

async function getPage(slug) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/get_page`, { slug });
    return response.data;
  }
  catch (error) {
    if (error.response) {
      console.log(error.response.data?.message ?? error.response.statusText)
    }
  }
  return null;
}

async function getSectionPosts(sectionId, page, filter = {}) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/section/${sectionId}/posts`, { params: { ...filter, page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
async function getPostsByTypeId(typeId, page, filter = {}) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getPostsByType/${typeId}`, { params: { ...filter, page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
async function getSearchResults(page, filter = {}) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/search`, { params: { ...filter, page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

async function getResultsPosts(filter = {}) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/assistant-search`, { params: { ...filter } });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}


async function getComponentPosts(ComponentId, filter = {}) { 
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/component/${ComponentId}/posts`, { params: { ...filter } });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
async function getSchoolProgram(id) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getSchoolProgram/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
}
async function getProgramSchool(id) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/getProgramSchool/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching school:", error);
  }
}


export { getMenus, getPage, getSectionPosts, getComponentPosts, getSchoolProgram, getProgramSchool, getSearchResults, getResultsPosts, getPostsByTypeId }
