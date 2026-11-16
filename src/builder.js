export class ProjectManager {    
    projects = [];

    addProject(project) {
        if (!(project instanceof Project)) {
            throw new TypeError("ProjectManager.addProject(): addProject(value) must be of type \"Project\"!");
        }
        this.projects.push(project);
    }

    removeProject(index) {
        if (index < 0 || index >= this.projects.length) {
            throw new RangeError(`ProjectManager.removeEntry(): Index ${index} is out of bounds.`);
        }
        this.projects.splice(index, 1);
    }

    save(key = "projManager") {
        localStorage.setItem(key, JSON.stringify(this));
    }

    static load(key = "projManager") {
        const manager = new ProjectManager();
        try {
            const raw = JSON.parse(localStorage.getItem(key));
            manager.projects = (raw?.projects ?? []).map(Project.fromJSON);
        } catch (err) {
            // corrupt/invalid data
            console.warn("Could not load saved projects: ", err);
        }
        return manager;
    }
}

export class Project {    
    constructor(title, desc = "", entries = []) {
        this.title = title;
        this.desc = desc;
        this.entries = entries;
    }

    addEntry(entry) {
        if (!(entry instanceof TodoEntry)) {
            throw new TypeError("Project.addEntry(): entry must be of type \"TodoEntry\"!");
        }
        this.entries.push(entry);
    }

    removeEntry(index) {
        this.entries.splice(index, 1);
    }

    static fromJSON(obj) {
        return new Project(obj.title, obj.desc, obj.entries.map(TodoEntry.fromJSON));
    }
}

export class TodoEntry {
    constructor(title, desc = "", dueDate = "", priority = "none", completed = false) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
    
    static fromJSON(obj) {
        return new TodoEntry(obj.title, obj.desc, obj.dueDate, obj.priority, obj.completed);
    }
}