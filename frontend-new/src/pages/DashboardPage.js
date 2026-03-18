import { auth } from "../auth/firebase"
import { useState, useEffect } from "react"
import { getApplications, createApplication } from "../services/applicationservice"

const DashboardPage = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        company: '', title: '', location: '',
        pay: '', link: '', job_type: 'Internship',
        notes: '', status: 'Not Applied Yet', date: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const token = await auth.currentUser.getIdToken()
            const data = await getApplications(token)
            setApplications(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await auth.currentUser.getIdToken()
        const newApp = await createApplication(token, formData)
        setApplications([...applications, newApp])
        setShowForm(false)
    }

    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Application'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input placeholder="Company" value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})} />
                    <input placeholder="Title" value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    <input placeholder="Location" value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    <input placeholder="Pay" value={formData.pay}
                        onChange={(e) => setFormData({...formData, pay: e.target.value})} />
                    <input placeholder="Job Link" value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})} />
                    <select value={formData.job_type}
                        onChange={(e) => setFormData({...formData, job_type: e.target.value})}>
                        <option value="Internship">Internship</option>
                        <option value="New Grad">New Grad</option>
                    </select>
                    <select value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="Not Applied Yet">Not Applied Yet</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Pending Interview">Pending Interview</option>
                        <option value="Completed Interview-Awaiting Offer">Completed Interview</option>
                        <option value="Offer accepted">Offer Accepted</option>
                    </select>
                    <input placeholder="Notes" value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                    <input type="date" value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    <button type="submit">Save</button>
                </form>
            )}

            {loading ? <p>Loading...</p> :
                <table>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Pay</th>
                            <th>Job Link</th>
                            <th>Job Type</th>
                            <th>Notes</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.company}</td>
                                <td>{app.title}</td>
                                <td>{app.location}</td>
                                <td>{app.pay}</td>
                                <td>{app.job_link}</td>
                                <td>{app.job_type}</td>
                                <td>{app.notes}</td>
                                <td>{app.status}</td>
                                <td>{app.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default DashboardPage