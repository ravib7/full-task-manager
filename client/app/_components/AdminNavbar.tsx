import Link from 'next/link'
import React from 'react'

const AdminNavbar = () => {
    return <>
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Admin Panel</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav ms-auto gap-3">
                        <Link className="nav-link active" href="/admin">Dashboard</Link>
                        <Link className="nav-link active" href="/admin/employee">Employee</Link>
                        <Link className="nav-link active" href="/admin/todo">Todos</Link>
                    </div>
                </div>
            </div>
        </nav>
    </>
}

export default AdminNavbar