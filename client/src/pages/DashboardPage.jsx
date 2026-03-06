import { useState, useEffect, useCallback } from "react";
import { taskAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
    HiOutlinePlus,
    HiOutlineRefresh,
    HiOutlineSearch,
    HiOutlineClipboardList,
} from "react-icons/hi";

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        status: "",
        priority: "",
        sortBy: "createdAt",
        order: "desc",
    });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filters };
            // Remove empty filters
            Object.keys(params).forEach((key) => {
                if (params[key] === "") delete params[key];
            });

            const { data } = await taskAPI.list(params);
            setTasks(data.data);
            setPagination(data.meta?.pagination || null);
        } catch (err) {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreate = async (formData) => {
        try {
            await taskAPI.create(formData);
            toast.success("Task created");
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create task");
        }
    };

    const handleUpdate = async (formData, id) => {
        try {
            await taskAPI.update(id, formData);
            toast.success("Task updated");
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update task");
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskAPI.remove(id);
            toast.success("Task deleted");
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete task");
        }
    };

    const handleSubmit = async (formData, id) => {
        if (id) {
            await handleUpdate(formData, id);
        } else {
            await handleCreate(formData);
        }
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    // Stats
    const totalTasks = pagination?.total || tasks.length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;

    return (
        <div className="dashboard-layout">
            <Navbar />

            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="dashboard-subtitle">
                            {isAdmin ? "Viewing all users' tasks" : `Welcome, ${user?.name}`}
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={openCreate}>
                        <HiOutlinePlus size={18} /> New Task
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-number">{totalTasks}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number" style={{ color: "#3b82f6" }}>
                            {inProgressCount}
                        </span>
                        <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number" style={{ color: "#10b981" }}>
                            {completedCount}
                        </span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="filter-group">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange("priority", e.target.value)}
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        >
                            <option value="createdAt">Date Created</option>
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                            <option value="status">Status</option>
                        </select>

                        <select
                            value={filters.order}
                            onChange={(e) => handleFilterChange("order", e.target.value)}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={fetchTasks}>
                        <HiOutlineRefresh size={16} /> Refresh
                    </button>
                </div>

                {/* Task Grid */}
                {loading ? (
                    <div className="loader-wrapper">
                        <div className="loader"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <HiOutlineClipboardList size={48} />
                        <h3>No tasks yet</h3>
                        <p>Create your first task to get started</p>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <HiOutlinePlus size={18} /> Create Task
                        </button>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={filters.page <= 1}
                            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={filters.page >= pagination.pages}
                            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleSubmit}
                editingTask={editingTask}
            />
        </div>
    );
}
