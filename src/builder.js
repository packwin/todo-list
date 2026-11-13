export { Builder };

class ProjectManager {
    constructor() {}
    
    #projects = [];

    get projects() {
        return [...this.#projects];
    }

    set projects(newArray) {
        this.#projects = [...newArray];
    }

    getProject(index) {
        return this.#projects[index];
    }

    setProject(index, value) {
        if (index < 0 || index >= this.#projects.length) {
            throw new RangeError(`ProjectManager.setProject(): Index ${index} is out of bounds.`);
        }

        if (!(value instanceof Project)) {
            throw new TypeError("ProjectManager.setProject(): setProject(value) must be of type \"Project\"!");
        }
        this.#projects[index] = value;
    }

    addProject(value) {
        if (!(value instanceof Project)) {
            throw new TypeError("ProjectManager.addProject(): addProject(value) must be of type \"Project\"!");
        }

        this.#projects.push(value);

        console.table(this.#projects);
    }

    removeProject(index) {
        if (index < 0 || index >= this.#projects.length) {
            throw new RangeError(`ProjectManager.removeEntry(): Index ${index} is out of bounds.`);
        }
        this.#projects.splice(index, 1);
    }
}

class Project {
    #entries = [];
    
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    get entries() {
        return [...this.#entries];
    }
    set entries(newArray) {
        this.#entries = [...newArray];
    }

    getEntry(index) {
        return this.#entries[index];
    }

    setEntry(index, value) {
        if (index < 0 || index >= this.#entries.length) {
            throw new RangeError(`Project.setEntry(): Index ${index} is out of bounds.`);
        }

        if (!(value instanceof TodoEntry)) {
            throw new TypeError("Project.setEntry(): entry must be of type \"TodoEntry\"!");
        }

        this.#entries[index] = value;
    }

    addEntry(value) {
        if (!(value instanceof TodoEntry)) {
            throw new TypeError("Project.addEntry(): entry must be of type \"TodoEntry\"!");
        }

        this.#entries.push(value);
        console.table(this.#entries);
    }

    removeEntry(index) {
        this.#entries.splice(index, 1);
    }

    
}

class TodoEntry {
    constructor(title, desc, dueDate, priority, subEntries = null) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.subEntries = subEntries == null ? null : [...subEntries];
    }
}

const Builder =  { ProjectManager, Project, TodoEntry };