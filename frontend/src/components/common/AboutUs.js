import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="about-page">

            {/* HERO */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <p className="about-eyebrow">OUR STORY</p>

                    <h1>
                        MORE THAN<br />
                        JUST CLOTHING.
                    </h1>
                </div>

                <div className="about-hero-image">
                    <div className="about-image-placeholder">
                        <span>WAJELWA</span>
                    </div>
                </div>
            </section>


            {/* WHY WAJELWA */}
            <section className="why-wajelwa">
                <div className="about-section-heading">
                    <p>THE BEGINNING</p>
                    <h2>WHY WAJELWA?</h2>
                </div>

                <div className="why-content">
                    <h3>
                        Clothing made for people
                        who aren't afraid to stand out.
                    </h3>

                    <p>
                        Wajelwa was created with the belief that clothing
                        is more than something you wear. It's a way to
                        express your individuality, your confidence and
                        the person you choose to be.
                    </p>

                    <p>
                        Every piece is designed to make a statement while
                        giving you the freedom to make it your own.
                    </p>
                </div>
            </section>


            {/* PURPOSE + PHILOSOPHY */}
            <section className="about-values">

                <div className="value-block">
                    <p>01 — OUR PURPOSE</p>

                    <h2>
                        EXPRESS<br />
                        WHO YOU ARE.
                    </h2>

                    <p className="value-text">
                        We create clothing that gives people the freedom
                        to express themselves through what they wear.
                    </p>
                </div>

                <div className="value-block">
                    <p>02 — OUR PHILOSOPHY</p>

                    <h2>
                        DON'T BLEND IN.
                    </h2>

                    <p className="value-text">
                        Individuality isn't something to hide.
                        It's something to wear.
                    </p>
                </div>

            </section>


            {/* BIG STATEMENT */}
            <section className="about-statement">

                <div className="statement-image">
                    <div className="statement-placeholder">
                        <span>DESIGNED TO STAND OUT</span>
                    </div>
                </div>

                <div className="statement-content">
                    <p>THE WAJELWA WAY</p>

                    <h2>
                        DESIGNED<br />
                        TO STAND OUT.
                    </h2>

                    <p>
                        Your style tells a story.
                        Make yours different.
                    </p>
                </div>

            </section>


            {/* VALUES */}
            <section className="wajelwa-way">

                <div className="about-section-heading">
                    <p>WHAT WE STAND FOR</p>
                    <h2>THE WAJELWA WAY</h2>
                </div>

                <div className="values-grid">

                    <div className="way-item">
                        <span>01</span>
                        <h3>INDIVIDUALITY</h3>
                        <p>Be unapologetically yourself.</p>
                    </div>

                    <div className="way-item">
                        <span>02</span>
                        <h3>CONFIDENCE</h3>
                        <p>Wear it boldly.</p>
                    </div>

                    <div className="way-item">
                        <span>03</span>
                        <h3>EXPRESSION</h3>
                        <p>Let your style speak.</p>
                    </div>

                    <div className="way-item">
                        <span>04</span>
                        <h3>CULTURE</h3>
                        <p>Be part of something.</p>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="about-cta">

                <p>THE LATEST DROP</p>

                <h2>
                    BE PART<br />
                    OF IT.
                </h2>

                <p>
                    Discover the latest Wajelwa collection.
                </p>

                <Link to="/products" className="about-cta-button">
                    SHOP NOW →
                </Link>

            </section>

        </div>
    );
};

export default About;