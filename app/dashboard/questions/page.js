import React from 'react';
import styles from './Questions.module.css'; // Adjust the import path as necessary

import facebookIcon from './facebook.png'
import twitterIcon from './discord.png';
// import linkedinIcon from './linkedin.png';
import instagramIcon from './instagram.png';

function Questions() {
  return (
    <div className={styles['about-wrapper']}>
      <div className={styles['about-left']}>
        <div className={styles['about-left-content']}>
          <div>
            <div className={styles['shadow']}>
              <div className={styles['about-img']}>
                <img src="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049__340.png" alt="about image" />
              </div>
            </div>
            <h2 className='text-bold text-gray-500'>Roushan Kumar</h2>
            <h3>Web developer</h3>
          </div>
          <ul className={styles.icons}>
        <li className={styles.facebook} style={{ backgroundImage: `url(${facebookIcon})` }}></li>
        <li className={styles.twitter} style={{ backgroundImage: `url(${twitterIcon})` }}></li>
        {/* <li className={styles.linkedin} style={{ backgroundImage: `url(${linkedinIcon})` }}></li> */}
        <li className={styles.instagram} style={{ backgroundImage: `url(${instagramIcon})` }}></li>
      </ul>
        </div>
      </div>

      <div className={styles['about-right']}>
        <h1>Hello<span>!</span></h1>
        {/* <h2>Here's who I am & what I do</h2> */}
        <div className={styles['about-btns']}>

          <button type="button" className={`${styles['btn']} ${styles['btn-white']}`}>Git hub</button>
        </div>
        <div className={styles['about-para']}>
         <p>I am currently a second-year student pursuing Electronics and Communication Engineering (ECE) at Netaji Subhas University of Technology (NSUT). I am passionate about coding and have developed multiple websites, showcasing my skills in web development. As a coder, I excel in problem-solving, algorithm design, and software development. My experience includes creating user-friendly interfaces, implementing functionality, and optimizing performance in web applications.</p>
        </div>
       
      </div>
    </div>
  );
}

export default Questions;
