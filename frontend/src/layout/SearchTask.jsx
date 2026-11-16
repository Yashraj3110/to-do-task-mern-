
import { useState } from 'react';

function SearchTasks({ tasks, onBack, onEdit, onView, onDelete, onStatusChange }) {
    const [keyword, setKeyword] = useState('');

    const filteredTasks = tasks.filter((task) => {
        const searchText = keyword.toLowerCase();

        return (
            task.title?.toLowerCase().includes(searchText) ||
            task.description?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="search-page">

            <div className="search-page-header">
                <button
                    className="btn p-0 border-0"
                    onClick={onBack}
                    aria-label="Back to dashboard"
                >
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
            </div>

            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search tasks..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    autoFocus
                />

                <i className="bi bi-search"></i>
            </div>

            <div className="search-task-list">

                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div className="search-task-item" key={task._id}>

                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={task.status === 'Completed'}
                                onChange={(e) =>
                                    onStatusChange(
                                        task._id,
                                        e.target.checked
                                            ? 'Completed'
                                            : 'In Progress'
                                    )
                                }
                            />

                            <span className={`search-task-title ${
                                task.status === 'Completed' ? 'completed' : ''
                            }`}>
                                {task.title}
                            </span>

                            <div className="search-task-actions">

                                <button
                                    onClick={() => onEdit(task)}
                                    title="Edit"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>

                                <button
                                    onClick={() => onView(task)}
                                    title="View"
                                >
                                    <i className="bi bi-eye"></i>
                                </button>

                                <button
                                    onClick={() => onDelete(task._id)}
                                    title="Delete"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>

                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center mt-4">
                        No tasks found.
                    </p>
                )}

            </div>
        </div>
    );
}

export default SearchTasks;
