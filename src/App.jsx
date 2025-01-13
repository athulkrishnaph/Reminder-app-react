import React, { useState, useEffect } from "react";
import "./App.css"; // Import your CSS file

function App() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReminder, setEditingReminder] = useState(null); // To track the reminder being edited
  const itemsPerPage = 4;

  // Format the time in 12-hour format
  const format12HourTime = (dateTime) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(dateTime).toLocaleString([], options);
  };

  // Load reminders from sessionStorage on app initialization
  useEffect(() => {
    const storedReminders = JSON.parse(sessionStorage.getItem("reminders"));
    if (storedReminders) {
      setReminders(storedReminders);
    }
  }, []);

  // Save reminders to sessionStorage whenever the reminders array changes
  useEffect(() => {
    if (reminders.length > 0) {
      sessionStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  // Add or update reminder
  const handleAddOrUpdateReminder = () => {
    if (!newReminder.trim() || !reminderDateTime.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const newReminderItem = {
      text: newReminder.trim(),
      dateTime: reminderDateTime,
      createdAt: new Date().toISOString(), // Capture the time of creation
      id: Date.now(),
    };

    if (editingReminder) {
      setReminders(
        reminders.map((reminder) =>
          reminder.id === editingReminder.id ? newReminderItem : reminder
        )
      );
      setEditingReminder(null);
    } else {
      setReminders([newReminderItem, ...reminders]);
    }

    setNewReminder("");
    setReminderDateTime("");
  };

  // Delete a reminder and remove it from sessionStorage
  const handleDeleteReminder = (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);
    sessionStorage.setItem("reminders", JSON.stringify(updatedReminders));
  };

  // Edit a reminder
  const handleEditReminder = (reminder) => {
    setNewReminder(reminder.text);
    setReminderDateTime(reminder.dateTime);
    setEditingReminder(reminder);
  };

  // Calculate displayed reminders for pagination
  const displayedReminders = reminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(reminders.length / itemsPerPage) || 1;

  return (
    <div className="app">
      <h1>EvoMind</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a reminder..."
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddOrUpdateReminder()}
        />
        <input
          type="datetime-local"
          value={reminderDateTime}
          onChange={(e) => setReminderDateTime(e.target.value)}
        />
        <button onClick={handleAddOrUpdateReminder}>
          {editingReminder ? "Update" : "Add"}
        </button>
      </div>

      <div className="reminder-list">
        {displayedReminders.length > 0 ? (
          displayedReminders.map((reminder) => (
            <div className="reminder-item" key={reminder.id}>
              <div>
                <span className="reminder-text">{reminder.text}</span>
                <span className="timestamp">
                  Reminder Time: {format12HourTime(reminder.dateTime)}
                </span>
                <span className="created-at">
                  Created At: {format12HourTime(reminder.createdAt)}
                </span>
              </div>
              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditReminder(reminder)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteReminder(reminder.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{color:'grey'}} className="no-reminders">
            No reminders to show 🚀 
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {reminders.length > 0 ? currentPage : 1} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages || reminders.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
