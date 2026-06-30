import '../App.css'

const services = [
    {
        icon: 'fas fa-code',
        title: 'Web Development',
        desc: 'Building responsive and modern web applications using HTML, CSS, JavaScript, and React.',
    },
    {
        icon: 'fas fa-crop-alt',
        title: 'UI/UX Design',
        desc: 'Designing clean and user-friendly interfaces with a focus on user experience and accessibility.',
    },
    {
        icon: 'fab fa-node-js',
        title: 'Backend Development',
        desc: 'Creating robust server-side applications and REST APIs using Node.js and Express.',
    },
]

export default function Services() {
    return (
        <section className="service" id="services">
            <h1 className="sub-title">My <span>Services</span></h1>
            <div className="service-list">
                {services.map((s, i) => (
                    <div key={i}>
                        <i className={s.icon} style={{ color: '#0ef' }}></i>
                        <h2>{s.title}</h2>
                        <p>{s.desc}</p>
                        <a href="#Contact" className="read">Learn More</a>
                    </div>
                ))}
            </div>
        </section>
    )
}
