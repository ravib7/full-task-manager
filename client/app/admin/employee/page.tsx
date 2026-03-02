"use client"

import { useGetEmployeesQuery } from '@/redux/apis/admin.api'
import clsx from 'clsx'
import React from 'react'

const AdminEmployee = () => {
    const { data } = useGetEmployeesQuery()

    const handleBgColor = (active: boolean, isDelete: boolean) => clsx({
        "table-success": active && !isDelete,
        "table-secondary": !active && !isDelete,
        "table-danger": isDelete
    })

    return <>
        <h1>Employee Register Form Goes Here</h1>

        {
            data && <table className='container table table-bordered table-hover'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>IsDelete</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.result.map(item => <tr className={handleBgColor(item.active, item.isDelete)}>
                            <td>{item._id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.mobile}</td>
                            <td>{item.role}</td>
                            <td>{item.active ? "Yes" : "No"}</td>
                            <td>{item.isDelete ? "Yes" : "No"}</td>
                            <td>
                                {
                                    item.isDelete
                                        ? <button className='btn btn-sm btn-warning'>Restore</button>
                                        : <div>
                                            <button className='btn btn-sm btn-outline-danger'>
                                                <i className='bi bi-pencil'></i>
                                            </button>

                                            <button className='btn btn-sm btn-outline-warning ms-2'>
                                                <i className='bi bi-trash'></i>
                                            </button>
                                        </div>
                                }

                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        }
    </>
}

export default AdminEmployee