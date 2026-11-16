
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Notyf } from 'notyf';

import 'notyf/notyf.min.css';

import TaskModal from './layout/TaskModal';
import TaskCard from './layout/TaskCard';
import SearchTasks from './layout/SearchTask';

const API ='https://to-do-task-mern-94bj.onrender.com/api/tasks';

const notyf = new Notyf({
    duration: 2500,
    position: {
        x: 'right',
        y: 'top'
    }
});

// Format date as YYYY-MM-DD
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Get Monday of selected week
function getWeekStart(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const difference = start.getDay() === 0
        ? -6
        : 1 - start.getDay();

    start.setDate(start.getDate() + difference);

    return start;
}

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showAll, setShowAll] = useState(false);
    const [showSearchPage, setShowSearchPage] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [selectedTask, setSelectedTask] = useState(null);

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(API);

            setTasks(response.data.data || []);

        } catch (err) {
            console.error(err);
            setError('Unable to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load tasks when Dashboard opens
    useEffect(() => {
        fetchTasks();
    }, []);

    // Dates for selected week
    const weekStart = getWeekStart(selectedDate);

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);

        weekDates.push(date);
    }

    // End date of selected week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

   
    const weeklyTasks = tasks.filter(task => {
        return (
            task.date >= getDateKey(weekStart) &&
            task.date <= getDateKey(weekEnd)
        );
    });

   
    const todayTasks = weeklyTasks.filter(task => {
        return task.date === getDateKey(selectedDate);
    });

   
    const visibleTasks = showAll
        ? weeklyTasks
        : todayTasks;

    // Weekly summary
    const completedTasks = weeklyTasks.filter(
        task => task.status === 'Completed'
    ).length;

    const pendingTasks = weeklyTasks.length - completedTasks;

    const progress = weeklyTasks.length
        ? Math.round((completedTasks / weeklyTasks.length) * 100)
        : 0;


    const handleAddTask = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    // Create or update task
    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                await axios.put(`${API}/${editingTask._id}`, formData);
                notyf.success('Task updated successfully');
            } else {
                await axios.post(API, formData);
                notyf.success('Task created successfully');
            }

            setShowModal(false);
            setEditingTask(null);

            await fetchTasks();

        } catch (err) {
            const message =
                err.response?.data?.message || 'Unable to save task';

            notyf.error(message);
            throw new Error(message);
        }
    };

    // Edit task
    const handleEditTask = (task) => {
        setSelectedTask(null);
        setEditingTask(task);
        setShowModal(true);
    };

    // View task details
    const handleViewTask = (task) => {
        setSelectedTask(task);
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await axios.delete(`${API}/${id}`);

            notyf.success('Task deleted successfully');

            setSelectedTask(null);

            await fetchTasks();

        } catch (err) {
            notyf.error(
                err.response?.data?.message || 'Unable to delete task'
            );
        }
    };

    // Update task status
    const handleStatusChange = async (id, status) => {
        try {
            const response = await axios.patch(`${API}/${id}/status`, {
                status
            });

            setTasks(prev =>
                prev.map(task =>
                    task._id === id ? response.data.data : task
                )
            );

            // Update currently opened details if applicable
            setSelectedTask(prev =>
                prev && prev._id === id
                    ? response.data.data
                    : prev
            );

            notyf.success('Task status updated');

        } catch (err) {
            notyf.error(
                err.response?.data?.message || 'Unable to update status'
            );
        }
    };

    // Heading date
    const formatHeadingDate = selectedDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className="todo-app">

            {showSearchPage ? (

                /* Separate Search Screen */
                <SearchTasks
                    tasks={tasks}
                    onBack={() => setShowSearchPage(false)}
                    onEdit={handleEditTask}
                    onView={handleViewTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                />

            ) : (

                /* Dashboard */
                <main className="container todo-container">

                    {/* Search Button */}
                    <div className="searchdiv">

                       <div> <button
        type="button"
        className="search-icon-button"
        onClick={() => setShowSearchPage(true)}
        aria-label="Search tasks"
    >
        <i className="bi bi-search"></i>
    </button></div>

                    </div>

                    {/* Weekly Date Selector */}
                    <section className="mb-4">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h6 className="section-title mb-0">
                                This Week
                            </h6>

                            <button
                                className="text-button"
                                onClick={() => {
                                    setSelectedDate(new Date());
                                    setShowAll(false);
                                }}
                            >
                                Today
                            </button>

                        </div>

                        <div className="week-date-list">

                            {weekDates.map(date => {
                                const key = getDateKey(date);

                                const active =
                                    key === getDateKey(selectedDate);

                                return (
                                    <button
                                        key={key}
                                        className={`week-date ${active ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setShowAll(false);
                                        }}
                                    >
                                        <span>
                                            {date.toLocaleDateString('en-IN', {
                                                weekday: 'short'
                                            })}
                                        </span>

                                        <strong>
                                            {date.getDate()}
                                        </strong>

                                        {active && (
                                            <span className="date-dot"></span>
                                        )}

                                    </button>
                                );
                            })}

                        </div>

                    </section>

                    {/* Summary Cards */}
                    <section className="row g-3 mb-4">

                        <div className="col-6">

                            <div className="summary-box completed-box">

                                <div className="summary-icon">
                                    <i className="bi bi-check2-square"></i>
                                </div>

                                <p>Tasks Complete</p>

                                <div className="summary-number">
                                    {completedTasks.toString().padStart(2, '0')}
                                </div>

                                <small>This Week</small>

                            </div>

                        </div>

                        <div className="col-6">

                            <div className="summary-box pending-box">

                                <div className="summary-icon">
                                    <i className="bi bi-hourglass-split"></i>
                                </div>

                                <p>Tasks Pending</p>

                                <div className="summary-number">
                                    {pendingTasks.toString().padStart(2, '0')}
                                </div>

                                <small>This Week</small>

                            </div>

                        </div>

                    </section>

                    {/* Weekly Progress */}
                    <section className="mb-4">

                        <div className="d-flex justify-content-between align-items-center mb-2">

                            <h6 className="section-title mb-0">
                                Weekly Progress
                            </h6>

                            <span className="progress-label">
                                {progress}%
                            </span>

                        </div>

                        <div className="progress todo-progress">

                            <div
                                className="progress-bar"
                                style={{ width: `${progress}%` }}
                            ></div>

                        </div>

                    </section>

                    {/* Task List */}
                    <section className="tasks-section">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <div>

                                <h6 className="section-title mb-1">
                                    {showAll
                                        ? 'All Tasks This Week'
                                        : 'Tasks Today'}
                                </h6>

                                <small className="text-muted">
                                    {formatHeadingDate}
                                </small>

                            </div>

                            <button
                                className="text-button"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? 'Today' : 'View All'}
                            </button>

                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="alert alert-danger">
                                {error}

                                <button
                                    className="btn btn-sm btn-outline-danger ms-2"
                                    onClick={fetchTasks}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && visibleTasks.length === 0 && (

                            <div className="empty-tasks">

                                <i className="bi bi-clipboard-check"></i>

                                <h6>No tasks found</h6>

                                <p>
                                    You have no tasks scheduled for this day.
                                </p>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddTask}
                                >
                                    Add a Task
                                </button>

                            </div>

                        )}

                        {/* Task Cards */}
                        {!loading && !error && visibleTasks.map(task => (

                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                            />

                        ))}

                    </section>

                </main>
            )}

           
            {!showSearchPage && (
                <button
                    className="add-task-fab"
                    onClick={handleAddTask}
                    aria-label="Add task"
                >
                    <i className="bi bi-plus-lg"></i>
                </button>
            )}

           
            <TaskModal
                show={showModal}
                editingTask={editingTask}
                onClose={() => {
                    setShowModal(false);
                    setEditingTask(null);
                }}
                onSave={handleSaveTask}
            />

            
            {selectedTask && (

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
                                        onClick={() => setSelectedTask(null)}
                                    ></button>

                                </div>

                                <div className="modal-body">

                                    <h5 className="fw-bold mb-3 task-details-title">
                                        {selectedTask.title}
                                    </h5>

                                    <div className="mb-4">

                                        <label className="text-muted small mb-1">
                                            Description
                                        </label>

                                        <p className="mb-0">
                                            {selectedTask.description || 'No description added.'}
                                        </p>

                                    </div>

                                    <hr />

                                    <div className="row g-3">

                                        <div className="col-6">

                                            <label className="text-muted small mb-1">
                                                Date
                                            </label>

                                            <div className="fw-semibold">
                                                {new Date(
                                                    `${selectedTask.date}T00:00:00`
                                                ).toLocaleDateString('en-IN', {
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
                                                {selectedTask.startTime || '--:--'}

                                                {selectedTask.endTime
                                                    ? ` - ${selectedTask.endTime}`
                                                    : ''}
                                            </div>

                                        </div>

                                        <div className="col-6">

                                            <label className="text-muted small mb-1">
                                                Priority
                                            </label>

                                            <div>

                                                <span className={`badge ${
                                                    selectedTask.priority === 'High'
                                                        ? 'bg-danger-subtle text-danger'
                                                        : selectedTask.priority === 'Low'
                                                            ? 'bg-success-subtle text-success'
                                                            : 'bg-warning-subtle text-dark'
                                                }`}>
                                                    {selectedTask.priority || 'Medium'}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="col-6">

                                            <label className="text-muted small mb-1">
                                                Status
                                            </label>

                                            <div>

                                                <span className={`badge ${
                                                    selectedTask.status === 'Completed'
                                                        ? 'bg-success-subtle text-success'
                                                        : 'bg-primary-subtle text-primary'
                                                }`}>
                                                    {selectedTask.status}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="modal-footer">

                                    <button
                                        className="btn btn-light"
                                        onClick={() => setSelectedTask(null)}
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleEditTask(selectedTask)}
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
                        onClick={() => setSelectedTask(null)}
                    ></div>
                </>

            )}

        </div>
    );
}

export default Dashboard;
