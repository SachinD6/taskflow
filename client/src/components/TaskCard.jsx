import { useState } from "react";
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineExclamation,
} from "react-icons/hi";

const statusConfig = {
    pending: { label: "Pending", icon: HiOutlineClock, color: "#f59e0b" },
    in_progress: { label: "In Progress", icon: HiOutlineExclamation, color: "#3b82f6" },
    completed: { label: "Completed", icon: HiOutlineCheckCircle, color: "#10b981" },
};

const priorityConfig = {
    low: { label: "Low", color: "#6b7280" },
    medium: { label: "Medium", color: "#f59e0b" },
    high: { label: "High", color: "#ef4444" },
};

export default function TaskCard({ task, onEdit, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const status = statusConfig[task.status] || statusConfig.pending;
    const priority = priorityConfig[task.priority] || priorityConfig.medium;
    const StatusIcon = status.icon;

    const handleDelete = async () => {
        if (!window.confirm("Delete this task?")) return;
        setDeleting(true);
        await onDelete(task._id);
        setDeleting(false);
    };

    return (
        <div className={`task-card ${deleting ? "deleting" : ""}`}>
            <div className="task-card-header">
                <div className="task-status-badge" style={{ background: `${status.color}18`, color: status.color }}>
                    <StatusIcon size={14} />
                    {status.label}
                </div>
                <div className="task-priority-dot" style={{ background: priority.color }} title={priority.label} />
            </div>

            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}

            <div className="task-card-footer">
                <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}
                </span>
                {task.user?.name && (
                    <span className="task-owner">{task.user.name}</span>
                )}
                <div className="task-actions">
                    <button className="btn-icon" onClick={() => onEdit(task)} title="Edit">
                        <HiOutlinePencil size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={handleDelete} disabled={deleting} title="Delete">
                        <HiOutlineTrash size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
