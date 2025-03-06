import React, { useState } from 'react';
import styles from './blog.module.css'; // Corrected the CSS module import
import baseimage from '../../assets/img/blogimage.png'; // Ensure this path is correct
import Image from "next/image";
import BlogIcon from '../../assets/img/calendaricon.png'; // Ensure this path is correct
import SubscribeSection from '../SubscribeSection/SubscribeSection';

// create blog // Corrected the function name
const Blog = () => {
    const cardData = Array(12).fill({
        title: 'Advantages of living in Fujairah, UAE',
        date: '06 August, 2024',
        description1: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard.'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Number of items per page
    const totalPages = Math.ceil(cardData.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = cardData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='container mt-3'>
            <div className={`${styles.title}`}>
                <h1>Article</h1>
            </div>
            <div className='row'>
                {paginatedData.map((card, index) => (
                    <div className='col-md-3' key={index}>
                        <div className={`card ${styles.card}`}>
                            <Image src={baseimage} className={`card-img-top ${styles['card-img-top']}`} alt='Image 1' />
                            <div className={`card-body ${styles['card-body']}`}>
                                <h5 className={`card-title ${styles['card-title']}`}>{card.title}</h5>
                                <ul className={`list-unstyled ${styles['card-list']}`}>
                                    <li className={`${styles.date}`}>
                                        <Image src={BlogIcon} alt='blogicon' /> {card.date}
                                    </li>
                                    <li>{card.description1}</li>
                                </ul>
                                <a href={`/blog/show?id=${index}`} className={`btn btn-primary ${styles['card-button']}`}>Read more</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <SubscribeSection />
        </div>
    );
};

export default Blog;