import React from 'react';
import './about.css';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsGithub, BsTwitter, BsLinkedin, BsEnvelope } from "react-icons/bs"
import { useState } from 'react';
export default function Header() {
    const [activeIndex, setActiveIndex] = useState(0);

    const [ajayHover, setAjayHover] = useState(false);
    

    const titles = ['About-RoadXamine', 'Our Mission', 'Our System', 'Our Team'];
    const description = ['RoadXamine is an innovative road damage detection and management system developed by a team of IT engineer - B. Ajay - in accordance with the guidelines of Vasavi College of Engineering. Our system is designed to continuously monitor road conditions and provide real-time data on road damage, allowing authorities to take swift action to ensure the safety and efficiency of road transportation.',
        'At RoadXamine, we are committed to using technology to make a positive impact on society. Our mission is to improve the safety and efficiency of road transportation by providing a reliable, efficient and user-friendly road damage detection and management system. We believe that by leveraging the latest advancements in machine learning and computer vision, we can help to reduce the number of accidents on our roads and improve the overall driving experience for everyone.',
        'RoadXamine is a cutting-edge system that uses advanced machine learning algorithms and CCTV cameras placed on roads to monitor the condition of roads in real-time. The system is capable of detecting damages. When damage is detected, the system sends an alert to the concerned officer, enabling swift action to be taken to repair the damage before it can cause further problems. The RoadXamine system is designed to be easy to use and user-friendly. The website provides a visual representation of the roads and displays any detected damage, allowing officers to quickly and easily identify areas that require attention. The website also provides detailed reports on the condition of roads, allowing officers to track the progress of repairs and monitor the overall health of their regions road infrastructure.'];

    const urls = ['https://logocorps.com/assets/images/new-animate/training/03.gif', 'https://i.pinimg.com/originals/50/78/a0/5078a05eb1b6847d93383eaa4c0ed500.gif', 'https://elearningindustry.com/wp-content/uploads/2020/10/what-are-the-benefits-of-animation-based-learning.jpg']
    const handleClick = (index) => {
        setActiveIndex(index);
    }


    const handleAjayMouseEnter = () => setAjayHover(true);
    const handleAjayMouseLeave = () => setAjayHover(false);


    return (
        <>
            <div className="container">
                <div className="about-col-1">
                    <img src="https://loudvideos.com/wp-content/uploads/2019/06/whiteboard-animation-and-explainer-video-studio.png" alt="" />
                    <div className='icons'>
                        <Link to="https://www.facebook.com"><BsFacebook className='face-icon' /></Link>
                        <Link to="https://www.facebook.com"><BsTwitter className='twitter-icon' /></Link>
                        <Link to="https://www.facebook.com"><BsInstagram className='insta-icon' /></Link>
                        <Link to="https://www.facebook.com"><BsLinkedin className='linkedin-icon' /></Link>
                        <Link to="https://www.facebook.com"><BsGithub className='git-icon' /></Link>
                        <Link to="https://www.facebook.com"><BsEnvelope className='mail-icon' /></Link>
                    </div>
                </div>
                <div className="about-col-2">
                    <h1>About Us</h1>
                    <div className='titles'>
                        {titles.map((title, index) => (
                            <h2 key={index} onClick={() => handleClick(index)} className={activeIndex === index ? 'active' : ''}>{title}</h2>
                        ))}
                    </div>
                    <div className='content'>
                        <p>{description[activeIndex]}</p>
                        {activeIndex === 0 ? <img src={urls[0]} alt="#" style={{ width: "50%", height: "50vh", borderRadius: "50%" }} /> : null}
                        {activeIndex === 1 ? <img src={urls[1]} alt="#" style={{ width: "50%", height: "50vh", borderRadius: "50%" }} /> : null}
                        {activeIndex === 2 ? <img src={urls[2]} alt="#" style={{ width: "50%", height: "50vh", borderRadius: "50%" }} /> : null}
                        {activeIndex === 3 ?
                            <div class="developer">
                                <img src="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg" alt="Ajay" onMouseEnter={handleAjayMouseEnter} onMouseLeave={handleAjayMouseLeave} />
                            </div>
                            : null}
                    </div>

                    {ajayHover ?
                        <div className='developer-details'>
                            <h3>Bathini Ajay Goud</h3>
                            <p>
                                Ajay is a talented software engineer with a passion for using
                                technology to make a difference in the world. He specializes in
                                computer vision and machine learning and has worked on a number of
                                exciting projects throughout his career.
                            </p>
                        </div>
                        : null}
                </div>
            </div>
            </>
            );
}
