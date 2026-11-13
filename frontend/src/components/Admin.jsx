import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3003'

/* ── Confirm Dialog ── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="dash-overlay">
            <div className="dash-confirm">
                <i className="fas fa-exclamation-triangle dash-confirm-icon"></i>
                <p>{message}</p>
                <div className="dash-confirm-btns">
                    <button className="dash-confirm-yes" onClick={onConfirm}>Yes, Delete</button>
                    <button className="dash-confirm-no" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

/* ── Login ── */
function LoginPage({ onLogin }) {
    const [pw, setPw] = useState('')
    const [err, setErr] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const getStoredPw = () => localStorage.getItem('admin_pw') || '123456'

    const submit = async (e) => {
        e.preventDefault()
        setErr('')
        if (pw === getStoredPw()) {
            onLogin()
            return
        }
        setIsSubmitting(true)

        try {
            const response = await fetch(`${API}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pw })
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setErr(data.error || 'Unable to sign in. Please try again.')
                return
            }
            onLogin()
        } catch {
            setErr('Could not reach the login service. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="dash-login-bg">
            <div className="dash-login-box">
                <div className="dash-login-logo"><i className="fas fa-shield-alt"></i></div>
                <h2>Admin Portal</h2>
                <p className="dash-login-sub">Sign in to your dashboard</p>
                <form onSubmit={submit}>
                    <div className="dash-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Enter password"
                            value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} required />
                    </div>
                    {err && <p className="dash-err">{err}</p>}
                    <button type="submit" className="dash-login-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'} <i className="fas fa-arrow-right"></i>
                    </button>
                </form>
                <Link to="/" className="dash-back-link">
                    <i className="fas fa-arrow-left"></i> Back to Portfolio
                </Link>
            </div>
        </div>
    )
}

/* ── Dashboard Shell ── */
export default function Admin() {
    const [authed, setAuthed] = useState(false)
    const [active, setActive] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />

    const navItems = [
        { key: 'overview', icon: 'fas fa-th-large', label: 'Overview' },
        { key: 'messages', icon: 'fas fa-envelope', label: 'Messages' },
        { key: 'projects', icon: 'fas fa-folder-open', label: 'Projects' },
        { key: 'profile', icon: 'fas fa-user-circle', label: 'Profile' },
        { key: 'settings', icon: 'fas fa-cog', label: 'Settings' },
    ]

    return (
        <div className="dash-root">
            <aside className={`dash-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
                <div className="dash-sidebar-header">
                    <i className="fas fa-shield-alt dash-brand-icon"></i>
                    {sidebarOpen && <span className="dash-brand-name">Admin</span>}
                </div>
                <nav className="dash-nav">
                    {navItems.map((item) => (
                        <button key={item.key}
                            className={`dash-nav-item${active === item.key ? ' active' : ''}`}
                            onClick={() => setActive(item.key)}>
                            <i className={item.icon}></i>
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>
                <div className="dash-sidebar-footer">
                    <Link to="/" className="dash-nav-item">
                        <i className="fas fa-home"></i>
                        {sidebarOpen && <span>Portfolio</span>}
                    </Link>
                    <button className="dash-nav-item" onClick={() => setAuthed(false)}>
                        <i className="fas fa-sign-out-alt"></i>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <div className="dash-main" style={{ marginLeft: sidebarOpen ? '230px' : '64px' }}>
                <header className="dash-topbar">
                    <button className="dash-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
                    </button>
                    <h1 className="dash-page-title">
                        {navItems.find((n) => n.key === active)?.label}
                    </h1>
                    <span className="dash-badge"><i className="fas fa-circle"></i> Online</span>
                </header>
                <div className="dash-content">
                    {active === 'overview' && <OverviewTab setActive={setActive} />}
                    {active === 'messages' && <MessagesTab />}
                    {active === 'projects' && <ProjectsTab />}
                    {active === 'profile' && <ProfileTab />}
                    {active === 'settings' && <SettingsTab />}
                </div>
            </div>
        </div>
    )
}

/* ── Overview ── */
function OverviewTab({ setActive }) {
    const [msgCount, setMsgCount] = useState(0)
    const [projCount, setProjCount] = useState(0)

    useEffect(() => {
        fetch(`${API}/api/messages`).then(r => r.json()).then(d => setMsgCount(d.length)).catch(() => { })
        fetch(`${API}/api/projects`).then(r => r.json()).then(d => setProjCount(d.length)).catch(() => { })
    }, [])

    const cards = [
        { icon: 'fas fa-envelope', label: 'Messages', value: msgCount, color: '#0ef', tab: 'messages' },
        { icon: 'fas fa-folder-open', label: 'Projects', value: projCount, color: '#f90', tab: 'projects' },
        { icon: 'fas fa-user-circle', label: 'Profile', value: 'Manage', color: '#a855f7', tab: 'profile' },
        { icon: 'fas fa-cog', label: 'Settings', value: 'Config', color: '#4ade80', tab: 'settings' },
    ]

    return (
        <div>
            <p className="dash-welcome">Welcome back, <strong>Kelem</strong></p>
            <div className="dash-stat-grid">
                {cards.map((c) => (
                    <button key={c.tab} className="dash-stat-card" onClick={() => setActive(c.tab)}>
                        <div className="dash-stat-icon" style={{ background: c.color + '22', color: c.color }}>
                            <i className={c.icon}></i>
                        </div>
                        <div>
                            <div className="dash-stat-value">{c.value}</div>
                            <div className="dash-stat-label">{c.label}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

/* ── Messages ── */
function MessagesTab() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirm, setConfirm] = useState(null)

    const load = () =>
        fetch(`${API}/api/messages`)
            .then(r => r.json()).then(d => { setMessages(d); setLoading(false) })
            .catch(() => setLoading(false))

    useEffect(() => { load() }, [])

    const doDelete = async () => {
        await fetch(`${API}/api/messages/${confirm}`, { method: 'DELETE' })
        setConfirm(null); load()
    }

    if (loading) return <p className="dash-empty">Loading...</p>
    if (!messages.length) return (
        <div className="dash-empty-box">
            <i className="fas fa-inbox"></i><p>No messages yet</p>
        </div>
    )

    return (
        <div>
            {confirm && <ConfirmDialog message="Delete this message?" onConfirm={doDelete} onCancel={() => setConfirm(null)} />}
            <div className="dash-table-wrap">
                <table className="dash-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>
                        {messages.map((m) => (
                            <tr key={m._id}>
                                <td>{m.name}</td><td>{m.email}</td>
                                <td>{m.subject || '—'}</td>
                                <td className="dash-msg-cell">{m.message}</td>
                                <td>{new Date(m.receivedAt).toLocaleDateString()}</td>
                                <td><button className="dash-row-del" onClick={() => setConfirm(m._id)}><i className="fas fa-trash"></i> Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* ── Projects ── */
function ProjectsTab() {
    const [projects, setProjects] = useState([])
    const [form, setForm] = useState({ title: '', desc: '', link: '' })
    const [imgFile, setImgFile] = useState(null)
    const [imgPreview, setImgPreview] = useState(null)
    const [status, setStatus] = useState('')
    const [isError, setIsError] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState(null)
    const [confirm, setConfirm] = useState(null)

    const load = () => fetch(`${API}/api/projects`).then(r => r.json()).then(setProjects).catch(() => { })
    useEffect(() => { load() }, [])

    const handleImg = (e) => {
        const file = e.target.files[0]; setImgFile(file)
        if (file) setImgPreview(URL.createObjectURL(file))
    }

    const openEdit = (p) => {
        setEditId(p._id)
        setForm({ title: p.title, desc: p.desc, link: p.link || '' })
        setImgFile(null)
        setImgPreview(p.imageUrl ? `${API}${p.imageUrl}` : null)
        setStatus('')
        setShowForm(true)
    }

    const resetForm = () => {
        setShowForm(false)
        setEditId(null)
        setForm({ title: '', desc: '', link: '' })
        setImgFile(null)
        setImgPreview(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); setStatus(editId ? 'Updating...' : 'Uploading...'); setIsError(false)
        const fd = new FormData()
        fd.append('title', form.title); fd.append('desc', form.desc); fd.append('link', form.link)
        if (imgFile) fd.append('image', imgFile)
        try {
            const url = editId ? `${API}/api/projects/${editId}` : `${API}/api/projects`
            const method = editId ? 'PUT' : 'POST'
            const res = await fetch(url, { method, body: fd })
            const data = await res.json()
            if (res.ok) {
                setStatus(editId ? 'Project updated!' : 'Project added!')
                resetForm()
                load()
            } else {
                setIsError(true); setStatus(data.error || 'Failed.')
            }
        } catch { setIsError(true); setStatus('Server error.') }
    }

    const doDelete = async () => {
        await fetch(`${API}/api/projects/${confirm}`, { method: 'DELETE' })
        setConfirm(null); load()
    }

    return (
        <div>
            {confirm && <ConfirmDialog message="Delete this project? This cannot be undone." onConfirm={doDelete} onCancel={() => setConfirm(null)} />}
            <div className="dash-section-bar">
                <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                <button className="dash-add-btn" onClick={() => { if (showForm) resetForm(); else { setShowForm(true); setStatus('') } }}>
                    <i className={`fas fa-${showForm ? 'times' : 'plus'}`}></i>
                    {showForm ? ' Cancel' : ' Add Project'}
                </button>
            </div>

            {showForm && (
                <div className="dash-form-card">
                    <h3><i className={`fas fa-${editId ? 'edit' : 'plus-circle'}`}></i> {editId ? 'Edit Project' : 'New Project'}</h3>
                    <form className="dash-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Project Title *" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <textarea placeholder="Project Description *" required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
                        <input type="url" placeholder="Project Link (optional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                        <div className="dash-img-upload-row">
                            <label className="dash-file-pick">
                                <i className="fas fa-image"></i>
                                {imgFile ? imgFile.name : 'Choose project image'}
                                <input type="file" accept="image/*" onChange={handleImg} />
                            </label>
                            {imgPreview && (
                                <div className="dash-img-preview">
                                    <img src={imgPreview} alt="preview" />
                                    <button type="button" className="dash-img-remove" onClick={() => { setImgFile(null); setImgPreview(null) }}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="dash-form-actions">
                            <button type="submit" className="dash-submit-btn"><i className={`fas fa-${editId ? 'save' : 'plus'}`}></i> {editId ? 'Save Changes' : 'Add Project'}</button>
                            {status && <p className={`dash-status${isError ? ' err' : ''}`}>{status}</p>}
                        </div>
                    </form>
                </div>
            )}

            {!projects.length && !showForm && (
                <div className="dash-empty-box"><i className="fas fa-folder-open"></i><p>No projects yet.</p></div>
            )}

            <div className="dash-proj-grid">
                {projects.map((p) => (
                    <div className="dash-proj-card" key={p._id}>
                        {p.imageUrl ? <img src={`${API}${p.imageUrl}`} alt={p.title} /> : <div className="dash-proj-no-img"><i className="fas fa-image"></i></div>}
                        <div className="dash-proj-body">
                            <strong>{p.title}</strong>
                            <p>{p.desc}</p>
                            {p.link && <a href={p.link} target="_blank" rel="noreferrer">{p.link}</a>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', padding: '12px' }}>
                            <button className="dash-submit-btn" style={{ flex: 1, margin: 0 }} onClick={() => openEdit(p)}>
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button className="dash-proj-del" style={{ flex: 1, margin: 0 }} onClick={() => setConfirm(p._id)}>
                                <i className="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Profile ── */
function ProfileTab() {
    const [profileImg, setProfileImg] = useState(null)
    const [cvFile, setCvFile] = useState(null)
    const [current, setCurrent] = useState({ profileImage: null, cvFile: null })
    const [status, setStatus] = useState('')
    const [isError, setIsError] = useState(false)
    const [confirm, setConfirm] = useState(null)

    const loadProfile = () => fetch(`${API}/api/profile`).then(r => r.json()).then(setCurrent).catch(() => { })
    useEffect(() => { loadProfile() }, [])

    const msg = (text, err = false) => { setStatus(text); setIsError(err) }

    const upload = async (endpoint, field, file, label) => {
        msg(`Uploading ${label}...`)
        const fd = new FormData(); fd.append(field, file)
        try {
            const res = await fetch(`${API}${endpoint}`, { method: 'POST', body: fd })
            const data = await res.json()
            if (res.ok) { msg(`${label} uploaded!`); return data }
            else msg(data.error || 'Failed.', true)
        } catch { msg('Server error.', true) }
    }

    const uploadPhoto = async (e) => {
        e.preventDefault(); if (!profileImg) return
        const d = await upload('/api/profile/image', 'profile', profileImg, 'Profile photo')
        if (d?.imageUrl) { setCurrent(c => ({ ...c, profileImage: d.imageUrl })); setProfileImg(null) }
    }

    const uploadCv = async (e) => {
        e.preventDefault(); if (!cvFile) return
        const d = await upload('/api/profile/cv', 'cv', cvFile, 'CV')
        if (d?.cvUrl) { setCurrent(c => ({ ...c, cvFile: d.cvUrl })); setCvFile(null) }
    }

    const doDelete = async () => {
        const endpoint = confirm === 'photo' ? '/api/profile/image' : '/api/profile/cv'
        await fetch(`${API}${endpoint}`, { method: 'DELETE' })
        if (confirm === 'photo') setCurrent(c => ({ ...c, profileImage: null }))
        else setCurrent(c => ({ ...c, cvFile: null }))
        msg(`${confirm === 'photo' ? 'Photo' : 'CV'} deleted.`)
        setConfirm(null)
    }

    return (
        <div className="dash-profile-grid">
            {confirm && <ConfirmDialog message={`Delete your ${confirm === 'photo' ? 'profile photo' : 'CV'}?`} onConfirm={doDelete} onCancel={() => setConfirm(null)} />}
            {status && <p className={`dash-status${isError ? ' err' : ''}`} style={{ gridColumn: '1/-1', marginBottom: '8px' }}>{status}</p>}

            <div className="dash-profile-card">
                <h3><i className="fas fa-camera"></i> Profile Photo</h3>
                <div className="dash-photo-preview">
                    {current.profileImage
                        ? <img src={`${API}${current.profileImage}`} alt="Profile" />
                        : <div className="dash-photo-placeholder"><i className="fas fa-user"></i></div>}
                </div>
                {current.profileImage && <button className="dash-delete-btn" onClick={() => setConfirm('photo')}><i className="fas fa-trash"></i> Delete Photo</button>}
                <form onSubmit={uploadPhoto} style={{ marginTop: '16px' }}>
                    <label className="dash-file-pick">
                        <i className="fas fa-upload"></i>
                        {profileImg ? profileImg.name : 'Choose photo'}
                        <input type="file" accept="image/*" onChange={e => setProfileImg(e.target.files[0])} />
                    </label>
                    <button type="submit" className="dash-submit-btn" style={{ marginTop: '12px' }}>
                        {current.profileImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                </form>
            </div>

            <div className="dash-profile-card">
                <h3><i className="fas fa-file-alt"></i> CV / Resume</h3>
                <div className="dash-cv-preview">
                    {current.cvFile
                        ? <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href={`${API}${current.cvFile}`} target="_blank" rel="noreferrer" className="dash-cv-btn"><i className="fas fa-eye"></i> View CV</a>
                            <a href={`${API}${current.cvFile}`} download className="dash-cv-btn"><i className="fas fa-download"></i> Download CV</a>
                          </div>
                        : <p className="dash-cv-empty">No CV uploaded yet</p>}
                </div>
                {current.cvFile && <button className="dash-delete-btn" onClick={() => setConfirm('cv')}><i className="fas fa-trash"></i> Delete CV</button>}
                <form onSubmit={uploadCv} style={{ marginTop: '16px' }}>
                    <label className="dash-file-pick">
                        <i className="fas fa-file-upload"></i>
                        {cvFile ? cvFile.name : 'Choose CV file'}
                        <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={e => setCvFile(e.target.files[0])} />
                    </label>
                    <button type="submit" className="dash-submit-btn" style={{ marginTop: '12px' }}>
                        {current.cvFile ? 'Change CV' : 'Upload CV'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ── Settings ── */
function SettingsTab() {
    const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
    const [status, setStatus] = useState('')
    const [isError, setIsError] = useState(false)
    const getStoredPw = () => localStorage.getItem('admin_pw') || '123456'

    const handleSubmit = (e) => {
        e.preventDefault()
        if (form.current !== getStoredPw()) { setIsError(true); setStatus('Current password is incorrect.'); return }
        if (form.newPw.length < 6) { setIsError(true); setStatus('New password must be at least 6 characters.'); return }
        if (form.newPw !== form.confirm) { setIsError(true); setStatus('Passwords do not match.'); return }
        localStorage.setItem('admin_pw', form.newPw)
        setIsError(false); setStatus('Password changed successfully!')
        setForm({ current: '', newPw: '', confirm: '' })
    }

    return (
        <div className="dash-settings">
            <div className="dash-profile-card" style={{ maxWidth: '480px' }}>
                <h3><i className="fas fa-key"></i> Change Password</h3>
                <p className="dash-login-hint">This password is saved only in this browser. To use one password across browsers, set <strong>ADMIN_PASSWORD</strong> in your backend deployment.</p>
                <form className="dash-form" onSubmit={handleSubmit}>
                    <div className="dash-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Current password" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} required />
                    </div>
                    <div className="dash-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="New password (min 6 chars)" value={form.newPw} onChange={e => setForm({ ...form, newPw: e.target.value })} required />
                    </div>
                    <div className="dash-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Confirm new password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                    </div>
                    {status && <p className={`dash-status${isError ? ' err' : ''}`}>{status}</p>}
                    <button type="submit" className="dash-submit-btn"><i className="fas fa-save"></i> Save Password</button>
                </form>
            </div>
        </div>
    )
}