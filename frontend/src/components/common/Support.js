import React, { useState } from 'react';

const Support = () => {

    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: 'How long does delivery take?',
            answer: 'Orders are processed as quickly as possible. Delivery times may vary depending on your location.'
        },
        {
            question: 'How can I track my order?',
            answer: 'Once your order has been processed and shipped, you will receive the relevant tracking information.'
        },
        {
            question: 'What is your returns policy?',
            answer: 'If you are not satisfied with your purchase, please contact our support team for assistance with your return.'
        },
        {
            question: 'Can I exchange my item?',
            answer: 'Yes. Please contact our support team with your order details and we will assist you with the exchange process.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We offer secure payment options during checkout. Available payment methods will be displayed when placing your order.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="support-page">

            {/* HERO */}
            <section className="support-hero">

                <p className="support-eyebrow">
                    SUPPORT
                </p>

                <h1>
                    HOW CAN<br />
                    WE HELP?
                </h1>

                <p className="support-intro">
                    We're here to help with your Wajelwa journey.
                    Find answers, manage your order or get in touch
                    with our team.
                </p>

            </section>


            {/* QUICK HELP */}
            <section className="quick-help">

                <div className="support-section-heading">
                    <p>NEED HELP?</p>
                    <h2>QUICK HELP</h2>
                </div>

                <div className="help-grid">

                    <div className="help-card">
                        <div className="help-icon">📦</div>
                        <h3>MY ORDER</h3>
                        <p>
                            Get help with your order and delivery.
                        </p>
                        <a href="#contact">GET HELP →</a>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">↩</div>
                        <h3>RETURNS</h3>
                        <p>
                            Information about returns and exchanges.
                        </p>
                        <a href="#faq">LEARN MORE →</a>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">🚚</div>
                        <h3>SHIPPING</h3>
                        <p>
                            Find information about delivery.
                        </p>
                        <a href="#faq">LEARN MORE →</a>
                    </div>

                    <div className="help-card">
                        <div className="help-icon">?</div>
                        <h3>FAQS</h3>
                        <p>
                            Find answers to common questions.
                        </p>
                        <a href="#faq">VIEW FAQS →</a>
                    </div>

                </div>

            </section>


            {/* FAQ */}
            <section className="faq-section" id="faq">

                <div className="support-section-heading">
                    <p>FIND YOUR ANSWER</p>
                    <h2>FREQUENTLY ASKED<br />QUESTIONS</h2>
                </div>

                <div className="faq-list">

                    {faqs.map((faq, index) => (

                        <div
                            className={`faq-item ${
                                openFAQ === index ? 'faq-open' : ''
                            }`}
                            key={index}
                        >

                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>

                                <span className="faq-toggle">
                                    {openFAQ === index ? '−' : '+'}
                                </span>
                            </button>

                            {openFAQ === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* CONTACT */}
            <section className="contact-section" id="contact">

                <div className="contact-content">

                    <div className="contact-heading">

                        <p>GET IN TOUCH</p>

                        <h2>
                            CONTACT<br />
                            US.
                        </h2>

                        <p>
                            Can't find what you're looking for?
                            Send us a message and we'll get back
                            to you.
                        </p>

                    </div>


                    <form
                        className="support-form"
                        onSubmit={(e) => e.preventDefault()}
                    >

                        <div className="support-form-group">

                            <label htmlFor="name">
                                NAME
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                required
                            />

                        </div>


                        <div className="support-form-group">

                            <label htmlFor="email">
                                EMAIL
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Your email"
                                required
                            />

                        </div>


                        <div className="support-form-group">

                            <label htmlFor="message">
                                MESSAGE
                            </label>

                            <textarea
                                id="message"
                                rows="6"
                                placeholder="How can we help?"
                                required
                            ></textarea>

                        </div>


                        <button
                            type="submit"
                            className="support-submit"
                        >
                            SEND MESSAGE →
                        </button>

                    </form>

                </div>

            </section>


            {/* FINAL CTA */}
            <section className="support-cta">

                <p>WE'RE HERE FOR YOU</p>

                <h2>
                    STILL NEED<br />
                    HELP?
                </h2>

                <p>
                    Our team is ready to assist you.
                </p>

                <a
                    href="#contact"
                    className="support-cta-button"
                >
                    CONTACT US →
                </a>

            </section>

        </div>
    );
};

export default Support;