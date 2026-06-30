import { useEffect, useState } from 'react'
import '../App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

export default function About() {
    const [profileImg, setProfileImg] = useState(null)

    useEffect(() => {
        fetch(`${API}/api/profile`)
            .then((r) => r.json())
            .then((d) => { if (d.profileImage) setProfileImg(`${API}${d.profileImage}`) })
            .catch(() => { })
    }, [])

    return (
        <section className="about" id="about">
            <div className="about-img">
                <img
                    src={profileImg || '/image/photo_2025-08-01_18-07-23.jpg'}
                    alt="Kelem Zhekale"
                />
            </div>
            <div className="about-text">
                <h2>About <span>Me</span></h2>
                <h4>Full Stack Developer!</h4>
                <p>
                    I am Kelem Zhekale, a software engineering student at Wollo University.
                    I am passionate about web development, problem solving, and building
                    modern applications. I specialize in frontend and backend development
                    and I am always eager to learn new technologies and take on new challenges.
                </p>
                <a href="#Contact" className="btn-box">Contact Me</a>
            </div>
        </section>
    )
}
