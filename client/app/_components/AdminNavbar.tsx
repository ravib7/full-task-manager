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
                    <div className="navbar-nav">
                        <a className="nav-link active" href="#">Home</a>
                        <a className="nav-link active" href="#">Pricing</a>
                        <a className="nav-link active" href="#">Features</a>
                        <a className="nav-link active" href="#">Features</a>
                    </div>
                </div>
            </div>
        </nav>
    </>
}

export default AdminNavbar