import '../App.css'

export default function Navbar() {
    return (
        <header className="header">
            <a href="#home" className="logo">Portfolio.</a>
            <nav className="navbar">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#skills">Skills</a>
                <a href="#Contact">Contact</a>
            </nav>
        </header>
    )
}
