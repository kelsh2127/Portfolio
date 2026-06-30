require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3003

// ── MongoDB ──
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch((e) => console.error('MongoDB error ❌', e.message))

// ── Schemas ──
const Message = mongoose.model('Message', new mongoose.Schema({
    name: String, email: String, subject: String,
    message: String, receivedAt: { type: Date, default: Date.now }
}))

const Project = mongoose.model('Project', new mongoose.Schema({
    title: String, desc: String, link: String,
    imageUrl: String, createdAt: { type: Date, default: Date.now }
}))

const Profile = mongoose.model('Profile', new mongoose.Schema({
    profileImage: { type: String, default: null },
    cvFile: { type: String, default: null }
}))

// ── Upload dirs ──
const uploadsDir = path.join(__dirname, 'uploads')
const projectsDir = path.join(uploadsDir, 'projects')
const profileDir = path.join(uploadsDir, 'profile')
    ;[uploadsDir, projectsDir, profileDir].forEach((d) => {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
    })

// ── Middleware ──
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// ── Multer ──
const mkStorage = (dest) => multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const uploadProject = multer({ storage: mkStorage(projectsDir) })
const uploadProfile = multer({ storage: mkStorage(profileDir) })

// helper — wraps async route so any thrown error returns JSON
const wrap = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error('Route error:', err.message)
        res.status(500).json({ error: err.message || 'Server error.' })
    })

// ── Contact ──
app.post('/api/contact', wrap(async (req, res) => {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message)
        return res.status(400).json({ error: 'Name, email and message are required.' })
    await Message.create({ name, email, subject: subject || '', message })
    res.json({ success: true, message: 'Message received!' })
}))

app.get('/api/messages', wrap(async (_req, res) => {
    res.json(await Message.find().sort({ receivedAt: -1 }))
}))

app.delete('/api/messages/:id', wrap(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ success: true })
}))

// ── Projects ──
app.get('/api/projects', wrap(async (_req, res) => {
    res.json(await Project.find().sort({ createdAt: -1 }))
}))

app.post('/api/projects', uploadProject.single('image'), wrap(async (req, res) => {
    const { title, desc, link } = req.body
    if (!title || !desc)
        return res.status(400).json({ error: 'Title and description required.' })
    const project = await Project.create({
        title, desc, link: link || '',
        imageUrl: req.file ? '/uploads/projects/' + req.file.filename : null
    })
    res.json({ success: true, project })
}))

app.delete('/api/projects/:id', wrap(async (req, res) => {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Not found.' })
    if (project.imageUrl) {
        const fp = path.join(__dirname, project.imageUrl)
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    await Project.findByIdAndDelete(req.params.id)
    res.json({ success: true })
}))

// ── Profile helper ──
async function getProfile() {
    let p = await Profile.findOne()
    if (!p) p = await Profile.create({})
    return p
}

app.get('/api/profile', wrap(async (_req, res) => {
    res.json(await getProfile())
}))

app.post('/api/profile/image', uploadProfile.single('profile'), wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
    const p = await getProfile()
    if (p.profileImage) {
        const old = path.join(__dirname, p.profileImage)
        if (fs.existsSync(old)) fs.unlinkSync(old)
    }
    p.profileImage = '/uploads/profile/' + req.file.filename
    await p.save()
    res.json({ success: true, imageUrl: p.profileImage })
}))

app.delete('/api/profile/image', wrap(async (_req, res) => {
    const p = await getProfile()
    if (p.profileImage) {
        const fp = path.join(__dirname, p.profileImage)
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    p.profileImage = null
    await p.save()
    res.json({ success: true })
}))

app.post('/api/profile/cv', uploadProfile.single('cv'), wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
    const p = await getProfile()
    if (p.cvFile) {
        const old = path.join(__dirname, p.cvFile)
        if (fs.existsSync(old)) fs.unlinkSync(old)
    }
    p.cvFile = '/uploads/profile/' + req.file.filename
    await p.save()
    res.json({ success: true, cvUrl: p.cvFile })
}))

app.delete('/api/profile/cv', wrap(async (_req, res) => {
    const p = await getProfile()
    if (p.cvFile) {
        const fp = path.join(__dirname, p.cvFile)
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    p.cvFile = null
    await p.save()
    res.json({ success: true })
}))

// ── Fallback → React ──
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT))
