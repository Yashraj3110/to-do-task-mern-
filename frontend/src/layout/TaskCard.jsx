
import { useState } from 'react';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {

    const [startX, setStartX] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

   
    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    //  swipe
    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        const difference = startX - endX;

        if (difference > 50) {
            setShowDelete(true);
        } else if (difference < -50) {
            setShowDelete(false);
        }
    };

    // Delete 
    const handleDelete = () => {
        onDelete(task._id);
        setShowDelete(false);
    };

    // Edit 
    const handleEdit = () => {
        setShowDetails(false);
        onEdit(task);
    };

    const taskDate = new Date(task.dateTime);

    return (
        <>
            <div className="task-swipe-wrapper">

                
                <div className="task-delete-action">
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                    </button>
                </div>

               
                <div
                    className={`task-content ${showDelete ? 'swiped' : ''}`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >

                    <div className="task-card-layout">
                        <input
                            type="checkbox"
                            className="form-check-input task-card-checkbox"
                            checked={task.status === 'Completed'}
                            aria-label={`Mark ${task.title} ${task.status === 'Completed' ? 'incomplete' : 'complete'}`}
                            onChange={(e) => {
                                onStatusChange(
                                    task._id,
                                    e.target.checked
                                        ? 'Completed'
                                        : 'In Progress'
                                );
                            }}
                        />

                        <button
                            type="button"
                            className={`task-title-button${task.status === 'Completed' ? ' is-completed' : ''}`}
                            onClick={() => setShowDetails(true)}
                        >
                            {task.title}
                        </button>

                        <div className="task-card-actions">
                            <button
                                type="button"
                                className="task-icon-button"
                                onClick={handleEdit}
                                title="Edit task"
                                aria-label={`Edit ${task.title}`}
                            >
                                <i className="bi bi-pencil-square" aria-hidden="true"></i>
                            </button>
                            <button
                                type="button"
                                className="task-icon-button task-delete-button"
                                onClick={() => {
                                    if (isTouchDevice) {
                                        setShowDelete(!showDelete);
                                    } else {
                                        onDelete(task._id);
                                    }
                                }}
                                title="Delete task"
                                aria-label={`Delete ${task.title}`}
                            >
                                <i className="bi bi-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

          
            {showDetails && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog task-details-dialog">
                            <div className="modal-content border-0 shadow">

                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">
                                        Task Details
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDetails(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">

                                    <h5 className="fw-bold mb-3 task-details-title">
                                        {task.title}
                                    </h5>

                                    <div className="mb-4">
                                        <label className="text-muted small mb-1">
                                            Description
                                        </label>

                                        <p className="mb-0">
                                            {task.description || 'No description added.'}
                                        </p>
                                    </div>

                                    <hr />

                                    <div className="row g-3">

                                        <div className="col-6">
                                            <label className="text-muted small mb-1">
                                                Date
                                            </label>

                                            <div className="fw-semibold">
                                                {taskDate.toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <label className="text-muted small mb-1">
                                                Time
                                            </label>

                                            <div className="fw-semibold">
                                                {taskDate.toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <label className="text-muted small mb-1">
                                                Priority
                                            </label>

                                            <div>
                                                <span className={`badge ${
                                                    task.priority === 'High'
                                                        ? 'bg-danger-subtle text-danger'
                                                        : task.priority === 'Low'
                                                            ? 'bg-success-subtle text-success'
                                                            : 'bg-warning-subtle text-dark'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <label className="text-muted small mb-1">
                                                Status
                                            </label>

                                            <div>
                                                <span className={`badge ${
                                                    task.status === 'Completed'
                                                        ? 'bg-success-subtle text-success'
                                                        : 'bg-primary-subtle text-primary'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-light"
                                        onClick={() => setShowDetails(false)}
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleEdit}
                                    >
                                        <i className="bi bi-pencil me-1"></i>
                                        Edit Task
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowDetails(false)}
                    ></div>
                </>
            )}
        </>
    );
}

export default TaskCard;
