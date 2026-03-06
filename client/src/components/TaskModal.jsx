import { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";

const defaultForm = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
};

export default function TaskModal({ isOpen, onClose, onSubmit, editingTask }) {
    const [form, setForm] = useState(defaultForm);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editingTask) {
            setForm({
                title: editingTask.title || "",
                description: editingTask.description || "",
                status: editingTask.status || "pending",
                priority: editingTask.priority || "medium",
                dueDate: editingTask.dueDate
                    ? new Date(editingTask.dueDate).toISOString().split("T")[0]
                    : "",
            });
        } else {
            setForm(defaultForm);
        }
    }, [editingTask, isOpen]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = { ...form };
        if (payload.dueDate) {
            payload.dueDate = new Date(payload.dueDate).toISOString();
        } else {
            delete payload.dueDate;
        }
        if (!payload.description) delete payload.description;

        await onSubmit(payload, editingTask?._id);
        setSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Additional details..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={form.status} onChange={handleChange}>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                value={form.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Saving..." : editingTask ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
