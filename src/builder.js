export { ProjectManager, Project, ProjectNodePair, TodoEntry, TodoNodePair };

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

        if (!(value instanceof ProjectNodePair)) {
            throw new TypeError("ProjectManager.addProject(): addProject(value) must be of type \"ProjectNodePair\"!");
        }
        this.#projects[index] = value;
    }

    addProject(value) {
        if (!(value instanceof ProjectNodePair)) {
            throw new TypeError("ProjectManager.addProject(): addProject(value) must be of type \"ProjectNodePair\"!");
        }

        this.#projects.push(value);
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
    
    constructor(title, desc) {
        this.title = title;
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
        if (!(value instanceof TodoNodePair)) {
            throw new TypeError("Project.addEntry(): entry must be of type \"TodoNodePair\"!");
        }

        this.#entries.push(value);
    }

    removeEntry(index) {
        this.#entries.splice(index, 1);
    }
}

class ProjectNodePair {
    constructor(data, node) {
        this.data = data;
        this.selectBtn = node;
    }
}

class TodoEntry {
    #node = null;
    #completed = false;

    constructor(title, desc, dueDate, priority, subEntries = null) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.subEntries = subEntries == null ? null : [...subEntries];
    }

    get node() {
        return this.#node;
    }
    set node(value) {
        if (typeof(value) != HTMLElement) {
            throw new TypeError("TodoEntry: set node(value) must be of type \"HTMLElement\"!");
        }
        
        this.#node = value;
    }

    get completed() {
        return this.#completed;
    }

    set completed(value) {
        if (typeof(value) != "boolean") {
            throw new TypeError("TodoEntry: set completed(value) must be of type \"Boolean\"!");
        }

        this.#completed = value;
    }
}

class TodoNodePair {
    constructor(data, node) {
        this.data = data;
        this.node = node;
    }
}