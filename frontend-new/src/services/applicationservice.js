export const getApplications = async (token) => {
    const response = await fetch('http://localhost:5001/api/applications/' , {
    headers: {
        'Authorization': `Bearer ${token}`
    }
        })
const data = await response.json()
return data
}

export const createApplication = async (token, data) => {
    const create = await fetch('http://localhost:5001/api/applications/' , {
        method : 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const created = await create.json()
    return created
    }

export const updateApplication = async (token, id, data) => {
    const edit = await fetch(`http://localhost:5001/api/applications/${id}` , {
        method : 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const updated = await edit.json()
    return updated
}

export const deleteApplication = async (token, id) => {
    const remove = await fetch(`http://localhost:5001/api/applications/${id}` , {
        method : 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }) 
    return remove
}