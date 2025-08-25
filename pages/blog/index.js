import React from 'react';
import axios from 'axios';
import Blog from '@/components/Blog/Blog';
import { BLOGS_API } from '@/routes/apiRoutes';

export const getServerSideProps = async ({ query }) => {
  const page = Number(query.page) || 1;
  const section = typeof query.section === 'string' ? query.section : '';

  const qs = new URLSearchParams();
  qs.set('page', String(page));
  if (section) qs.set('section', section);

  try {
    const { data } = await axios.get(`${BLOGS_API}?${qs.toString()}`);
    return {
      props: {
        initialData: Array.isArray(data?.data) ? data.data : [],
        initialTotalPages: Number(data?.last_page) || 1,
        initialPage: page,
        section,
      },
    };
  } catch (e) {
    console.error('Error fetching blogs:', e?.response?.data || e?.message);
    return {
      props: {
        initialData: [],
        initialTotalPages: 1,
        initialPage: page,
        section,
      },
    };
  }
};

const BlogIndexPage = ({ initialData, initialTotalPages, initialPage, section }) => {
  return (
    <Blog
      initialData={initialData}
      initialTotalPages={initialTotalPages}
      initialPage={initialPage}
      section={section}
    />
  );
};

export default BlogIndexPage;
