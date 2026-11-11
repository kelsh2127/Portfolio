import { useEffect, useState } from 'react'
import '../App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

export default function Portfolio() {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch(`${API}/api/projects`)
            .then((r) => r.json())
            .then(setProjects)
            .catch(() => { })
    }, [])

    if (!projects.length) return null

    return (
        <section className="portfolio-section" id="portfolio">
            <h2 id="myk">Training <span>Projects</span></h2>
            <div className="proj-grid">
                {projects.map((p) => (
                    <div className="proj-card" key={p._id}>
                        <div className="proj-img-wrap">
                            {p.imageUrl
                                ? <img src={`${API}${p.imageUrl}`} alt={p.title} />
                                : <div className="proj-img-placeholder"><i className="fas fa-image"></i></div>
                            }
                        </div>
                        <div className="proj-info">
                            <h4 className="proj-title">{p.title}</h4>
                            <p className="proj-desc">{p.desc}</p>
                            {p.link && (
                                <a href={p.link} target="_blank" rel="noreferrer" className="proj-link">
                                    <i className="fas fa-external-link-alt"></i> View Project
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
