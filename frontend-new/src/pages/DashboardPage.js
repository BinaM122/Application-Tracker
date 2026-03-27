import { auth } from "../auth/firebase"
import { signOut } from "firebase/auth"
import { useState, useEffect } from "react"
import { getApplications, createApplication, updateApplication, deleteApplication } from "../services/applicationservice"

const EMPTY_FORM = {
    company: '', title: '', location: '',
    pay: '', link: '', job_type: 'Internship',
    notes: '', status: 'Not Applied Yet', date: ''
}

const COLUMNS = ['Company', 'Title', 'Location', 'Pay', 'Job Link', 'Job Type', 'Notes', 'Status', 'Date']

const DashboardPage = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState(EMPTY_FORM)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await auth.currentUser.getIdToken()
                const data = await getApplications(token)
                setApplications(data)
            } catch (err) {
                setError("Failed to load applications. Please refresh and try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const openCreateForm = () => {
        setEditingId(null)
        setFormData(EMPTY_FORM)
        setShowForm(true)
    }

    const openEditForm = (app) => {
        setEditingId(app.id)
        setFormData({
            company: app.company ?? '',
            title: app.title ?? '',
            location: app.location ?? '',
            pay: app.pay ?? '',
            link: app.job_link ?? '',
            job_type: app.job_type ?? 'Internship',
            notes: app.notes ?? '',
            status: app.status ?? 'Not Applied Yet',
            date: app.date ?? ''
        })
        setShowForm(true)
    }

    const cancelForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData(EMPTY_FORM)
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            const token = await auth.currentUser.getIdToken()
            if (editingId) {
                const updated = await updateApplication(token, editingId, formData)
                setApplications(applications.map(app => app.id === editingId ? updated : app))
            } else {
                const newApp = await createApplication(token, formData)
                setApplications([...applications, newApp])
            }
            cancelForm()
        } catch (err) {
            setError(editingId ? "Failed to update application." : "Failed to create application.")
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this application?")) return
        setError(null)
        try {
            const token = await auth.currentUser.getIdToken()
            await deleteApplication(token, id)
            setApplications(applications.filter(app => app.id !== id))
        } catch (err) {
            setError("Failed to delete application.")
        }
    }

    const handleSignOut = async () => {
        setError(null)
        try {
            await signOut(auth)
        } catch (err) {
            setError("Failed to sign out. Please try again.")
        }
    }

    const field = (key) => ({
        value: formData[key],
        onChange: (e) => setFormData({ ...formData, [key]: e.target.value })
    })

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.heading}>Applications</h1>
                <div style={styles.headerActions}>
                    <button style={styles.btnPrimary} onClick={openCreateForm}>
                        + Add Application
                    </button>
                    <button style={styles.btnGhost} onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div style={styles.errorBanner} role="alert">
                    <span>{error}</span>
                    <button style={styles.errorDismiss} onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>{editingId ? 'Edit Application' : 'New Application'}</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>
                            <input style={styles.input} placeholder="Company" required {...field('company')} />
                            <input style={styles.input} placeholder="Title" required {...field('title')} />
                            <input style={styles.input} placeholder="Location" {...field('location')} />
                            <input style={styles.input} placeholder="Pay" {...field('pay')} />
                            <input style={styles.input} placeholder="Job Link" {...field('link')} />
                            <input style={styles.input} type="date" {...field('date')} />
                            <select style={styles.input} {...field('job_type')}>
                                <option value="Internship">Internship</option>
                                <option value="New Grad">New Grad</option>
                            </select>
                            <select style={styles.input} {...field('status')}>
                                <option value="Not Applied Yet">Not Applied Yet</option>
                                <option value="Waiting">Waiting</option>
                                <option value="Pending Interview">Pending Interview</option>
                                <option value="Completed Interview-Awaiting Offer">Completed Interview</option>
                                <option value="Offer accepted">Offer Accepted</option>
                            </select>
                            <input style={{ ...styles.input, gridColumn: '1 / -1' }} placeholder="Notes" {...field('notes')} />
                        </div>
                        <div style={styles.formActions}>
                            <button type="button" style={styles.btnGhost} onClick={cancelForm}>Cancel</button>
                            <button type="submit" style={styles.btnPrimary}>
                                {editingId ? 'Save Changes' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>{COLUMNS.map(c => <th key={c} style={styles.th}>{c}</th>)}<th style={styles.th}>Actions</th></tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: COLUMNS.length + 1 }).map((_, j) => (
                                        <td key={j} style={styles.td}>
                                            <div style={{ ...styles.skeleton, width: j === COLUMNS.length ? 80 : '70%' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : applications.length === 0 ? (
                <div style={styles.empty}>No applications yet. Add one above.</div>
            ) : (
                <div style={styles.tableWrap}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {COLUMNS.map(c => <th key={c} style={styles.th}>{c}</th>)}
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id} style={styles.tr}>
                                    <td style={styles.td}>{app.company}</td>
                                    <td style={styles.td}>{app.title}</td>
                                    <td style={styles.td}>{app.location}</td>
                                    <td style={styles.td}>{app.pay}</td>
                                    <td style={styles.td}>
                                        {app.job_link
                                            ? <a href={app.job_link} target="_blank" rel="noreferrer" style={styles.link}>Link</a>
                                            : '—'}
                                    </td>
                                    <td style={styles.td}>{app.job_type}</td>
                                    <td style={styles.td}>{app.notes}</td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.badge, ...statusStyle(app.status) }}>{app.status}</span>
                                    </td>
                                    <td style={styles.td}>{app.date}</td>
                                    <td style={styles.td}>
                                        <div style={styles.rowActions}>
                                            <button style={styles.btnEdit} onClick={() => openEditForm(app)}>Edit</button>
                                            <button style={styles.btnDelete} onClick={() => handleDelete(app.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                tr:hover td { background: #f8f9fb; }
            `}</style>
        </div>
    )
}

const statusStyle = (status) => {
    const map = {
        'Not Applied Yet':                   { background: '#f1f3f5', color: '#6c757d' },
        'Waiting':                           { background: '#fff3cd', color: '#856404' },
        'Pending Interview':                 { background: '#cfe2ff', color: '#084298' },
        'Completed Interview-Awaiting Offer':{ background: '#d1ecf1', color: '#0c5460' },
        'Offer accepted':                    { background: '#d1e7dd', color: '#0a3622' },
    }
    return map[status] ?? { background: '#f1f3f5', color: '#6c757d' }
}

const styles = {
    page: {
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 24px',
        color: '#1a1a2e',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    heading: {
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        gap: 10,
    },
    btnPrimary: {
        padding: '8px 18px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
    },
    btnGhost: {
        padding: '8px 18px',
        background: 'transparent',
        color: '#374151',
        border: '1.5px solid #d1d5db',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
    },
    btnEdit: {
        padding: '4px 12px',
        background: '#f0f4ff',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    btnDelete: {
        padding: '4px 12px',
        background: '#fff0f0',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    errorBanner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 20,
        fontSize: 14,
        fontWeight: 500,
    },
    errorDismiss: {
        background: 'none',
        border: 'none',
        color: '#991b1b',
        cursor: 'pointer',
        fontSize: 16,
        lineHeight: 1,
        padding: 0,
    },
    formCard: {
        background: '#fff',
        border: '1.5px solid #e5e7eb',
        borderRadius: 12,
        padding: '24px',
        marginBottom: 28,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    formTitle: {
        margin: '0 0 18px',
        fontSize: 18,
        fontWeight: 700,
    },
    form: {},
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 16,
    },
    input: {
        padding: '9px 12px',
        border: '1.5px solid #d1d5db',
        borderRadius: 8,
        fontSize: 14,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        background: '#fafafa',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
    },
    tableWrap: {
        overflowX: 'auto',
        borderRadius: 12,
        border: '1.5px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14,
    },
    th: {
        textAlign: 'left',
        padding: '12px 14px',
        background: '#f9fafb',
        borderBottom: '1.5px solid #e5e7eb',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: '#374151',
    },
    td: {
        padding: '11px 14px',
        borderBottom: '1px solid #f3f4f6',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
    },
    tr: {
        transition: 'background 0.1s',
    },
    rowActions: {
        display: 'flex',
        gap: 6,
    },
    badge: {
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 500,
    },
    empty: {
        textAlign: 'center',
        padding: '60px 0',
        color: '#9ca3af',
        fontSize: 15,
    },
    skeleton: {
        height: 14,
        borderRadius: 6,
        background: '#e5e7eb',
        animation: 'pulse 1.4s ease-in-out infinite',
    },
}

export default DashboardPage