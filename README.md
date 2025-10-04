# Todo List Web Application

A modern, responsive todo list web application built with vanilla HTML, CSS, and JavaScript. Features a beautiful dark theme with purple accents and comprehensive functionality for managing tasks.

## Features

- ✅ **Add Tasks**: Create new todos with task description and due date
- 📅 **Date Management**: Set due dates with validation (no past dates)
- 🔍 **Filter Tasks**: Filter by All, Pending, or Completed tasks
- ✏️ **Edit Status**: Mark tasks as complete or pending
- 🗑️ **Delete Tasks**: Remove individual tasks or delete all at once
- 💾 **Local Storage**: Data persists between browser sessions
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Dark Theme**: Modern dark UI with purple accent colors
- ⌨️ **Keyboard Shortcuts**: 
  - `Enter` to add todo
  - `Ctrl/Cmd + Enter` to add todo
  - `Escape` to clear inputs
  - `Ctrl/Cmd + F` to toggle filter

## File Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling in one file
├── js/
│   └── script.js       # All functionality in one file
└── README.md           # This file
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding your todos!

## Usage

### Adding a Todo
1. Enter your task description in the "Add a todo..." field
2. Select a due date (must be today or future)
3. Click the "+" button or press Enter

### Managing Todos
- **Complete/Undo**: Click the "Complete" or "Undo" button in the Actions column
- **Delete**: Click the "Delete" button to remove a specific todo
- **Filter**: Click "FILTER" to cycle through All → Pending → Completed
- **Delete All**: Click "DELETE ALL" to remove all todos (with confirmation)

### Form Validation
- Task description is required and limited to 100 characters
- Due date is required and cannot be in the past
- Real-time validation with visual feedback

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Storage**: Browser localStorage for data persistence
- **Responsive**: Mobile-first design with CSS Grid and Flexbox
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support
- **Performance**: Optimized animations and reduced motion support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.

## Live Demo

Visit the live application: [GitHub Pages URL will be added after deployment]

---

Built with ❤️ using vanilla web technologies
