require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const app = express()
const PORT = process.env.PORT || 3003

// ── Email Transporter ──
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected ✅')
        await initializeAdmin()
    })
    .catch((e) => console.error('MongoDB error ❌', e.message))

// ── Password Hashing Helpers ──
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
    if (!stored || !stored.includes(':')) return false
    const [salt, key] = stored.split(':')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'))
}

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

const AdminSchema = new mongoose.Schema({
    username: { type: String, default: 'admin' },
    passwordHash: { type: String, required: true }
})
const Admin = mongoose.model('Admin', AdminSchema)

async function initializeAdmin() {
    let admin = await Admin.findOne()
    if (!admin) {
        const initialPw = process.env.ADMIN_PASSWORD || '123456'
        await Admin.create({ passwordHash: hashPassword(initialPw) })
        console.log('Default admin credentials initialized in MongoDB 🔒')
    }
}

// ── Multer (Memory Storage) ──
const upload = multer({ storage: multer.memoryStorage() })

const fileToBase64 = (file) => {
    if (!file) return null
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
}

// ── Middleware ──
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)) {
            return callback(null, true)
        }
        callback(new Error('Not allowed by CORS'))
    }
}))

app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// helper — Hoisted function wrapper so it can be used anywhere in routes
function wrap(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error('Route error:', err.message)
            res.status(500).json({ error: err.message || 'Server error.' })
        })
    }
}

// ── Admin Auth & Password Management ──
app.post('/api/admin/login', wrap(async (req, res) => {
    const { password } = req.body
    if (typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required.' })
    }
    const admin = await Admin.findOne()
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
        return res.status(401).json({ error: 'Incorrect password. Try again.' })
    }
    res.json({ success: true })
}))

app.put('/api/admin/password', wrap(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Valid current password and new password (min 6 chars) required.' })
    }
    const admin = await Admin.findOne()
    if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
        return res.status(401).json({ error: 'Current password is incorrect.' })
    }
    admin.passwordHash = hashPassword(newPassword)
    await admin.save()
    res.json({ success: true, message: 'Password updated successfully in database!' })
}))

// ── Contact ──
app.post('/api/contact', wrap(async (req, res) => {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message)
        return res.status(400).json({ error: 'Name, email and message are required.' })

    await Message.create({ name, email, subject: subject || '', message })

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Message: ${subject || 'No Subject'}`,
            text: `You received a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`
        }).catch(err => console.error('Email error:', err.message))
    }

    res.json({ success: true, message: 'Message received and emailed!' })
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

app.post('/api/projects', upload.single('image'), wrap(async (req, res) => {
    const { title, desc, link } = req.body
    if (!title || !desc)
        return res.status(400).json({ error: 'Title and description required.' })
    const project = await Project.create({
        title, desc, link: link || '',
        imageUrl: fileToBase64(req.file)
    })
    res.json({ success: true, project })
}))

app.put('/api/projects/:id', upload.single('image'), wrap(async (req, res) => {
    const { title, desc, link } = req.body
    if (!title || !desc)
        return res.status(400).json({ error: 'Title and description required.' })

    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found.' })

    project.title = title
    project.desc = desc
    project.link = link || ''
    if (req.file) {
        project.imageUrl = fileToBase64(req.file)
    }

    await project.save()
    res.json({ success: true, project })
}))

app.delete('/api/projects/:id', wrap(async (req, res) => {
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

app.post('/api/profile/image', upload.single('profile'), wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
    const p = await getProfile()
    p.profileImage = fileToBase64(req.file)
    await p.save()
    res.json({ success: true, imageUrl: p.profileImage })
}))

app.delete('/api/profile/image', wrap(async (_req, res) => {
    const p = await getProfile()
    p.profileImage = null
    await p.save()
    res.json({ success: true })
}))

app.post('/api/profile/cv', upload.single('cv'), wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
    const p = await getProfile()
    p.cvFile = fileToBase64(req.file)
    await p.save()
    res.json({ success: true, cvUrl: p.cvFile })
}))

app.delete('/api/profile/cv', wrap(async (_req, res) => {
    const p = await getProfile()
    p.cvFile = null
    await p.save()
    res.json({ success: true })
}))

// ── Backend health check ──
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Portfolio backend is running 🚀',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    })
})

// ── API fallback ──
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    })
})

// ── Start Server ──
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})