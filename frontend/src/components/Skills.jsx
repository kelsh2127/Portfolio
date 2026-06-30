import '../App.css'

const techSkills = [
    { name: 'HTML', pct: 90, cls: 'html', icon: 'fab fa-html5', color: '#fa243d' },
    { name: 'CSS', pct: 85, cls: 'css', icon: 'fab fa-css3', color: '#8309ee' },
    { name: 'Bootstrap', pct: 80, cls: 'bootstrap', icon: 'fab fa-bootstrap', color: '#7952b3' },
    { name: 'JavaScript', pct: 80, cls: 'javascript', icon: 'fab fa-js', color: 'rgb(228,248,8)' },
    { name: 'React', pct: 70, cls: 'react', icon: 'fab fa-react', color: 'cyan' },
    { name: 'Node.js', pct: 70, cls: 'nodejs', icon: 'fab fa-node-js', color: '#68a063' },
    { name: 'PHP', pct: 65, cls: 'php', icon: 'fab fa-php', color: '#8892be' },
    { name: 'Python', pct: 75, cls: 'python', icon: 'fab fa-python', color: '#147bbc' },
    { name: 'Django', pct: 60, cls: 'django', icon: 'fas fa-server', color: '#44b78b' },
    { name: 'Laravel', pct: 60, cls: 'laravel', icon: 'fab fa-laravel', color: '#ff2d20' },
]

const profSkills = [
    { label: 'Creativity', pct: 90, radialAnim: 'radialLoop1' },
    { label: 'Communication', pct: 70, radialAnim: 'radialLoop2' },
    { label: 'Problem Solving', pct: 80, radialAnim: 'radialLoop3' },
    { label: 'Team Work', pct: 90, radialAnim: 'radialLoop4' },
]

// stagger delay so each bar starts slightly after the previous
const DURATION = 3   // seconds per full cycle
const STAGGER = 0.3 // seconds between each bar

export default function Skills() {
    return (
        <section id="skills">
            <h1 className="sub-title" style={{ paddingTop: '60px' }}>My <span>Skills</span></h1>
            <div className="skills-section">

                {/* Technical Skills */}
                <div>
                    <h1 className="heading1">Technical Skills</h1>
                    <div className="technical-bars">
                        {techSkills.map((s, i) => {
                            const delay = `${i * STAGGER}s`
                            const dur = `${DURATION}s`
                            return (
                                <div className="bar" key={s.name}>
                                    <i className={s.icon} style={{ color: s.color }}></i>
                                    <div className="info">
                                        <span style={{ animation: `textLoop ${dur} ${delay} ease-in-out infinite` }}>
                                            {s.name}
                                        </span>
                                        <span className="percentage"
                                            style={{ animation: `textLoop ${dur} ${delay} ease-in-out infinite` }}>
                                            {s.pct}%
                                        </span>
                                    </div>
                                    <div className={`progress-line ${s.cls}`}>
                                        <span style={{ animation: `barLoop ${dur} ${delay} ease-in-out infinite` }}></span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Professional Skills */}
                <div>
                    <h1 className="heading1">Professional Skills</h1>
                    <div className="radial-bar">
                        {profSkills.map((s, i) => {
                            const delay = `${i * STAGGER}s`
                            const dur = `${DURATION}s`
                            return (
                                <div className="radial-bars" key={i}>
                                    <svg viewBox="0 0 200 200">
                                        <circle className="progress-bar-circle" cx="100" cy="100" r="80" />
                                        <circle
                                            className="path"
                                            cx="100" cy="100" r="80"
                                            style={{ animation: `${s.radialAnim} ${dur} ${delay} ease-in-out infinite` }}
                                        />
                                    </svg>
                                    <div className="percentagek"
                                        style={{ animation: `textLoop ${dur} ${delay} ease-in-out infinite` }}>
                                        {s.pct}%
                                    </div>
                                    <div className="textk"
                                        style={{ animation: `textLoop ${dur} ${delay} ease-in-out infinite` }}>
                                        {s.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}
