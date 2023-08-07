import { formatDate, extractDates } from './utils.js';

let notes = [
    // List notes
];

function addNote(name, category, content) {
    if (name.trim() !== '') {
        const id = Date.now().toString();
        const created = formatDate(new Date());
        const newNote = {
            id,
            name,
            created,
            category,
            content,
            archived: false
        };
        notes.push(newNote);
    }
}

function editNote(id, name, category, content) {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            name,
            category,
            content
        };
    }
}

function toggleArchiveNote(id, archived) {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].archived = archived;
    }
}

function removeNote(id) {
    notes = notes.filter(note => note.id !== id);
}

function removeAllNotes() {
    notes = [];
}

function renderNotesTable() {
    const notesTable = document.querySelector('#notes-table tbody');
    notesTable.innerHTML = '';

    notes.forEach(note => {
        if (!note.archived) {
            const tr = document.createElement('tr');

            for (const key in note) {
                if (key !== 'id') {
                    const td = document.createElement('td');
                    td.textContent = note[key];
                    tr.appendChild(td);
                }
            }

            const dates = extractDates(note.content).join(', ');
            const datesTd = document.createElement('td');
            datesTd.textContent = dates;
            tr.appendChild(datesTd);

            const editTd = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => openModal(note.id));
            editTd.appendChild(editButton);
            tr.appendChild(editTd);

            const archiveTd = document.createElement('td');
            const archiveButton = document.createElement('button');
            archiveButton.textContent = 'Archive';
            archiveButton.addEventListener('click', () => {
                toggleArchiveNote(note.id, true);
                render();
            });
            archiveTd.appendChild(archiveButton);
            tr.appendChild(archiveTd);

            const removeTd = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeNote(note.id);
                render();
            });
            removeTd.appendChild(removeButton);
            tr.appendChild(removeTd);

            tr.id = note.id;
            notesTable.appendChild(tr);
        }
    });
}

function renderSummaryTable() {
    const summaryTable = document.querySelector('#summary-table tbody');
    summaryTable.innerHTML = '';

    const categories = ['Task', 'Random Thought', 'Idea'];
    categories.forEach(category => {
        const tr = document.createElement('tr');

        const categoryTd = document.createElement('td');
        categoryTd.textContent = category;
        tr.appendChild(categoryTd);

        const activeCountTd = document.createElement('td');
        activeCountTd.textContent = getNumberOfNotesByCategory(category, false);
        tr.appendChild(activeCountTd);

        const archivedCountTd = document.createElement('td');
        archivedCountTd.textContent = getNumberOfNotesByCategory(category, true);
        tr.appendChild(archivedCountTd);

        summaryTable.appendChild(tr);
    });
}

function render() {
    renderNotesTable();
    renderSummaryTable();
}

function openModal(id) {
    const modal = document.querySelector('#modal');
    const modalTitle = document.querySelector('#modal h2');
    const modalForm = document.querySelector('form');

    if (id) {
        const note = notes.find(note => note.id === id);
        modalTitle.textContent = 'Edit Note';
        modalForm.id = id;
        document.querySelector('#name').value = note.name;
        document.querySelector('#category').value = note.category;
        document.querySelector('#content').value = note.content;
    } else {
        modalTitle.textContent = 'Add New Note';
        modalForm.id = '';
        document.querySelector('#name').value = '';
        document.querySelector('#category').value = 'Task';
        document.querySelector('#content').value = '';
    }

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.querySelector('#modal');
    const modalForm = document.querySelector('form');

    modalForm.reset();
    modal.style.display = 'none';
}

function submitForm() {
    const id = document.querySelector('form').id;
    const name = document.querySelector('#name').value;
    const category = document.querySelector('#category').value;
    const content = document.querySelector('#content').value;

    if (id) {
        editNote(id, name, category, content);
    } else {
        addNote(name, category, content);
    }

    closeModal();
    render();
}

document.querySelector('#create-button').addEventListener('click', () => openModal());
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    submitForm();
});
document.querySelector('#cancel-button').addEventListener('click', () => closeModal());
document.querySelector('#unarchive-all').addEventListener('click', () => {
    notes.forEach(note => {
        if (note.archived) {
            note.archived = false;
        }
    });
    render();
});
document.querySelector('#remove-all').addEventListener('click', () => {
    removeAllNotes();
    render();
});

render();
