import '../App.css'
import { BrainCircuit } from 'lucide-react'

const services = [
    {
        icon: 'fas fa-code',
        title: 'Full-Stack Web Development',
        desc: 'Building responsive, scalable, and modern web applications using Next.js, Node.js, Laravel, and PostgreSQL. Developing complete solutions with seamless frontend and backend integration.',
    },
    {
        icon: BrainCircuit,
        title: 'Machine Learning & AI',
        desc: 'Exploring intelligent solutions through machine learning, data analysis, and predictive modeling using Python and machine learning technologies.',
    },
    {
        icon: 'fab fa-node-js',
        title: 'Backend & Database Development',
        desc: 'Designing secure REST APIs, managing databases, and building reliable server-side applications using Node.js, Express.js, Laravel, and PostgreSQL.',
    },
]

export default function Services() {
    return (
        <section className="service" id="services">
            <h1 className="sub-title">My <span>Services</span></h1>
            <div className="service-list">
                {services.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <div key={i}>
                            {typeof Icon === 'string'
                                ? <i className={Icon} style={{ color: '#0ef' }}></i>
                                : <Icon size={70} color="#00E5F5" strokeWidth={2.5} aria-hidden="true" />
                            }
                            <h2>{s.title}</h2>
                            <p>{s.desc}</p>
                            <a href="#Contact" className="read">Learn More</a>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
