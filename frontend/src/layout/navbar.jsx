
function Navbar({ search, setSearch }) {
    return (
        <nav className="todo-navbar">
            <div className="todo-navbar-content">
                <div className="input-group navbar-search">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a task"
                        aria-label="Search tasks"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="input-group-text">
                        <i className="bi bi-search" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
