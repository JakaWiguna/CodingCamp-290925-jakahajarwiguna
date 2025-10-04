// Todo List Application
class TodoApp {
    constructor() {
        this.todos = [];
        this.filteredTodos = [];
        this.currentFilter = 'all'; // 'all', 'pending', 'completed'
        this.nextId = 1;
        
        this.initializeElements();
        this.loadFromStorage();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.dateInput = document.getElementById('dateInput');
        this.addBtn = document.getElementById('addBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.todoTableBody = document.getElementById('todoTableBody');
    }

    attachEventListeners() {
        // Add todo functionality
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter functionality
        this.filterBtn.addEventListener('click', () => this.toggleFilter());

        // Delete all functionality
        this.deleteAllBtn.addEventListener('click', () => this.deleteAllTodos());

        // Real-time validation
        this.todoInput.addEventListener('input', () => this.validateInput());
        this.dateInput.addEventListener('change', () => this.validateInput());
    }

    validateInput() {
        const todoText = this.todoInput.value.trim();
        const dateValue = this.dateInput.value;
        
        // Remove existing error styling
        this.todoInput.classList.remove('error');
        this.dateInput.classList.remove('error');
        
        // Validate todo text
        if (todoText.length === 0) {
            this.todoInput.classList.add('error');
            return false;
        }
        
        if (todoText.length > 100) {
            this.todoInput.classList.add('error');
            this.showNotification('Task description must be less than 100 characters', 'error');
            return false;
        }
        
        // Validate date
        if (!dateValue) {
            this.dateInput.classList.add('error');
            return false;
        }
        
        const selectedDate = new Date(dateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            this.dateInput.classList.add('error');
            this.showNotification('Due date cannot be in the past', 'error');
            return false;
        }
        
        return true;
    }

    addTodo() {
        if (!this.validateInput()) {
            this.showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        const todoText = this.todoInput.value.trim();
        const dueDate = this.dateInput.value;
        
        const newTodo = {
            id: this.nextId++,
            text: todoText,
            dueDate: dueDate,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo); // Add to beginning
        this.saveToStorage();
        this.applyFilter();
        this.render();
        this.clearInputs();
        
        this.showNotification('Todo added successfully!', 'success');
    }

    toggleFilter() {
        const filters = ['all', 'pending', 'completed'];
        const currentIndex = filters.indexOf(this.currentFilter);
        this.currentFilter = filters[(currentIndex + 1) % filters.length];
        
        this.applyFilter();
        this.render();
        this.updateFilterButton();
    }

    applyFilter() {
        switch (this.currentFilter) {
            case 'pending':
                this.filteredTodos = this.todos.filter(todo => todo.status === 'pending');
                break;
            case 'completed':
                this.filteredTodos = this.todos.filter(todo => todo.status === 'completed');
                break;
            default:
                this.filteredTodos = [...this.todos];
        }
    }

    updateFilterButton() {
        const filterLabels = {
            'all': 'FILTER: ALL',
            'pending': 'FILTER: PENDING',
            'completed': 'FILTER: COMPLETED'
        };
        this.filterBtn.textContent = filterLabels[this.currentFilter];
    }

    toggleTodoStatus(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.status = todo.status === 'pending' ? 'completed' : 'pending';
            this.saveToStorage();
            this.applyFilter();
            this.render();
            
            const statusText = todo.status === 'completed' ? 'completed' : 'marked as pending';
            this.showNotification(`Todo ${statusText}!`, 'success');
        }
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.applyFilter();
            this.render();
            this.showNotification('Todo deleted successfully!', 'success');
        }
    }

    deleteAllTodos() {
        if (this.todos.length === 0) {
            this.showNotification('No todos to delete', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete all ${this.todos.length} todos? This action cannot be undone.`)) {
            this.todos = [];
            this.nextId = 1;
            this.saveToStorage();
            this.applyFilter();
            this.render();
            this.showNotification('All todos deleted successfully!', 'success');
        }
    }

    render() {
        if (this.filteredTodos.length === 0) {
            this.todoTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="4" class="empty-message">
                        ${this.currentFilter === 'all' ? 'No task found' : 
                          this.currentFilter === 'pending' ? 'No pending tasks' : 
                          'No completed tasks'}
                    </td>
                </tr>
            `;
            return;
        }

        this.todoTableBody.innerHTML = this.filteredTodos.map(todo => `
            <tr class="todo-row" data-id="${todo.id}">
                <td class="task-cell">${this.escapeHtml(todo.text)}</td>
                <td class="date-cell">${this.formatDate(todo.dueDate)}</td>
                <td class="status-cell">
                    <span class="status-badge status-${todo.status}">
                        ${todo.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="action-btn complete-btn" onclick="todoApp.toggleTodoStatus(${todo.id})">
                        ${todo.status === 'pending' ? 'Complete' : 'Undo'}
                    </button>
                    <button class="action-btn delete-btn" onclick="todoApp.deleteTodo(${todo.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();
        
        if (isToday) {
            return 'Today';
        } else if (isTomorrow) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearInputs() {
        this.todoInput.value = '';
        this.dateInput.value = '';
        this.todoInput.classList.remove('error');
        this.dateInput.classList.remove('error');
        this.todoInput.focus();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    saveToStorage() {
        try {
            const data = {
                todos: this.todos,
                nextId: this.nextId
            };
            localStorage.setItem('todoApp', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showNotification('Error saving data to browser storage', 'error');
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('todoApp');
            if (data) {
                const parsed = JSON.parse(data);
                this.todos = parsed.todos || [];
                this.nextId = parsed.nextId || 1;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.showNotification('Error loading data from browser storage', 'error');
        }
    }

    // Public method to get statistics
    getStats() {
        const total = this.todos.length;
        const pending = this.todos.filter(todo => todo.status === 'pending').length;
        const completed = this.todos.filter(todo => todo.status === 'completed').length;
        
        return { total, pending, completed };
    }

    // Public method to export todos
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Todos exported successfully!', 'success');
    }

    // Public method to import todos
    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTodos = JSON.parse(e.target.result);
                if (Array.isArray(importedTodos)) {
                    const maxId = Math.max(...this.todos.map(t => t.id), 0);
                    importedTodos.forEach((todo, index) => {
                        todo.id = maxId + index + 1;
                        if (!todo.status) todo.status = 'pending';
                        if (!todo.createdAt) todo.createdAt = new Date().toISOString();
                    });
                    
                    this.todos = [...this.todos, ...importedTodos];
                    this.nextId = Math.max(...this.todos.map(t => t.id)) + 1;
                    this.saveToStorage();
                    this.applyFilter();
                    this.render();
                    this.showNotification(`${importedTodos.length} todos imported successfully!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing todos. Please check file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to add todo
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            todoApp.addTodo();
        }
        
        // Escape to clear inputs
        if (e.key === 'Escape') {
            todoApp.clearInputs();
        }
        
        // Ctrl/Cmd + F to toggle filter
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            todoApp.toggleFilter();
        }
    });
    
    // Add service worker for offline functionality (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but that's okay
        });
    }
});

// Add CSS for error states and notifications
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .notification {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .notification {
            transition: none !important;
        }
    }
`;
document.head.appendChild(style);
