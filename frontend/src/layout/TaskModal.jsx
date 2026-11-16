
import { useEffect, useState } from 'react';

function getDateParts(task) {
    if (task?.date) {
        return {
            date: task.date,
            startTime: task.startTime || ''
        };
    }

    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return {
        date: `${year}-${month}-${day}`,
        startTime: ''
    };
}

function TaskModal({ show, editingTask, onClose, onSave }) {

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    // Load task details when opening the modal
    useEffect(() => {
        if (show) {
            if (editingTask) {
                const parts = getDateParts(editingTask);

                setTitle(editingTask.title || '');
                setDate(parts.date);
                setStartTime(parts.startTime);
                setEndTime(editingTask.endTime || '');
                setDescription(editingTask.description || '');
            } else {
                const parts = getDateParts();

                setTitle('');
                setDate(parts.date);
                setStartTime('');
                setEndTime('');
                setDescription('');
            }
        }
    }, [show, editingTask]);

    // Save task
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !date || !startTime) {
            return;
        }

        const formData = {
            title: title.trim(),
            description: description.trim(),
            date,
            startTime,
            endTime,
            priority: 'Medium'
        };

        console.log('Sending task data:', formData);

        try {
            setSaving(true);
            await onSave(formData);
        } catch (error) {
            console.error('Task save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div
                className="modal show task-modal-backdrop"
                style={{ display: 'block' }}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered task-modal-dialog">
                    <div className="modal-content task-modal-content">

                        <form onSubmit={handleSubmit}>

                            {/* Header */}
                            <div className="task-modal-header">
                                <h5>
                                    {editingTask ? 'Edit Task' : 'Add New Task'}
                                </h5>

                                <button
                                    type="button"
                                    className="task-modal-close"
                                    onClick={onClose}
                                    disabled={saving}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            {/* Form */}
                            <div className="task-modal-body">

                                <div className="mb-3">
                                    <label className="form-label">
                                        Task title
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control task-input"
                                        placeholder="Enter task title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        maxLength="150"
                                        required
                                    />
                                </div>

                                {/* Start and End time */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Set Time
                                    </label>

                                    <div className="row g-2">

                                        <div className="col-6">
                                            <div className="task-time-input">
                                                <i className="bi bi-clock"></i>

                                                <input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={e => setStartTime(e.target.value)}
                                                    required
                                                    aria-label="Start time"
                                                />
                                            </div>
                                            <small>Start</small>
                                        </div>

                                        <div className="col-6">
                                            <div className="task-time-input">
                                                <i className="bi bi-clock"></i>

                                                <input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={e => setEndTime(e.target.value)}
                                                    aria-label="End time"
                                                />
                                            </div>
                                            <small>Ends</small>
                                        </div>

                                    </div>
                                </div>

                                {/* Date */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Set Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control task-input"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-2">
                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-control task-input task-description"
                                        placeholder="Add Description"
                                        rows="4"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                            </div>

                            {/* Submit button */}
                            <div className="task-modal-footer">
                                <button
                                    type="submit"
                                    className="btn task-submit-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : editingTask
                                            ? 'Save Changes'
                                            : 'Create task'
                                    }
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop show task-backdrop"
                onClick={saving ? undefined : onClose}
            ></div>
        </>
    );
}

export default TaskModal;
