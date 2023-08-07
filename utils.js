export function extractDatesFromNoteContent(content) {
    const regex = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    return content.match(regex) || [];
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export function getNumberOfNotesByCategory(notes, category, archived) {
    return notes.reduce((count, note) => {
        if (note.category === category && note.archived === archived) {
            return count + 1;
        }
        return count;
    }, 0);
}
