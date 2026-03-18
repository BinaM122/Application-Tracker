import { auth } from "../auth/firebase"
import {useState, useEffect} from "react"
import { getApplications } from "../services/applicationservice"

const DashboardPage = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //const token = await auth.currentUser.getIdToken
        const fetchData = async () => {
            const token = await auth.currentUser.getIdToken()
            const data = await getApplications(token)
            setApplications(data)
            setLoading(false)
        }
            fetchData()
    }, [])

    return (
    <div>
        {loading ? <p>Loading...</p> : 
            <table>
    <thead>
        <tr>
            <th>Company</th>
            <th>Title</th>
            <th>location</th>
            <th>pay</th>
            <th>job_link</th>
            <th>job_type</th>
            <th>notes</th>
            <th>status</th>
            <th>date</th>

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