import { useState } from 'react'
import '../App.css'

const API = 'http://localhost:3003'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState('')
    const [isError, setIsError] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('Sending...')
        setIsError(false)
        try {
            const res = await fetch(`${API}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus('Message sent successfully!')
                setForm({ name: '', email: '', subject: '', message: '' })
            } else {
                setIsError(true)
                setStatus(data.error || 'Failed to send message.')
            }
        } catch {
            setIsError(true)
            setStatus('Server error. Please try again later.')
        }
    }

    return (
        <section className="Contact" id="Contact">
            <div className="Contact-text">
                <h2>Contact <span>Me</span></h2>
                <h4>Let's Work Together</h4>
                <p id="myp">
                    I am Kelem Zhekale, a software engineering student at Wollo University.
                    I am passionate about technology and software development. If you want to
                    collaborate or have any questions, feel free to reach out!
                </p>
                <div className="contact-list">
                    <li className="myl">
                        <i className="fas fa-envelope" style={{ color: '#0ef' }}></i>
                        kelsh7440@gmail.com
                    </li>
                    <li className="myl">
                        <i className="fas fa-phone-alt" style={{ color: '#0ef' }}></i>
                        0921632611
                    </li>
                </div>
                <div className="contact-items">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>

            <div className="contact-form">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Enter your Name"
                        value={form.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Enter your Email"
                        value={form.email} onChange={handleChange} required />
                    <input type="text" name="subject" placeholder="Enter your Subject"
                        value={form.subject} onChange={handleChange} />
                    <textarea name="message" placeholder="Enter your Message"
                        value={form.message} onChange={handleChange} required></textarea>
                    <input type="submit" value="Send Message" id="send" />
                    {status && <p className={`status-msg${isError ? ' error' : ''}`}>{status}</p>}
                </form>
            </div>
        </section>
    )
}
