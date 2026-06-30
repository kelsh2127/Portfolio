import { useEffect, useRef, useState } from 'react'
import '../App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

export default function Home() {
    const typedRef = useRef(null)
    const [profileImg, setProfileImg] = useState(null)

    // Fetch profile photo from backend
    useEffect(() => {
        fetch(`${API}/api/profile`)
            .then((r) => r.json())
            .then((d) => { if (d.profileImage) setProfileImg(`${API}${d.profileImage}`) })
            .catch(() => { })
    }, [])

    // Typed.js
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12'
        script.onload = () => {
            typedRef.current = new window.Typed('.typed-text', {
                strings: ['FullStack Web Developer', 'Graphics Designer'],
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
                loop: true,
            })
        }
        document.body.appendChild(script)
        return () => { if (typedRef.current) typedRef.current.destroy() }
    }, [])

    return (
        <section className="home" id="home">
            <div className="home-contact">
                <h3>Hello, it is me</h3>
                <h1>Kelem Zhekale</h1>
                <h3>And I Am a <span className="typed-text"></span></h3>
                <p>
                    I am a software engineering student at Wollo University, passionate about
                    building web applications and solving real-world problems through technology.
                </p>
                <div className="home-sc1">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-whatsapp"></i></a>
                    <a href="#"><i className="fab fa-tiktok"></i></a>
                </div>
                <a href="#about" className="btn-box">More About Me</a>
            </div>
            <div className="home-img">
                <img
                    src={profileImg || '/image/photo_2025-08-01_18-07-23.jpg'}
                    alt="Kelem Zhekale"
                />
            </div>
        </section>
    )
}
