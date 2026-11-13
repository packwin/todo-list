import "./styles.css";
import { Builder } from "./builder.js";

const manager = new Builder.ProjectManager();

const projectCards = [];

const projectsDiv = document.getElementById("projects-div");

function addProject(projectObj) {
    const projectCard = createProjectContainer(projectObj);
    projectsDiv.append(projectCard.node);

    manager.addProject(projectObj);
    projectCards.push(projectCard);
}

function createProjectContainer(project) {
    const title = project.name;
    const desc = project.desc;

    const container = document.createElement("div");
    container.classList.add("project-container")

    const header = document.createElement("h2");
    header.textContent = title;
    container.append(header);

    const subtitle = document.createElement("h4");
    subtitle.textContent = desc;
    container.append(subtitle);

    const entriesDiv = document.createElement("div");
    entriesDiv.classList.add("project-entries-container");
    container.append(entriesDiv);

    const projectObj = {
        node: container, 
        title: header, 
        desc: subtitle,
        entriesDiv: entriesDiv, 
        projectRef: project,
    };

    container.classList.add("proj-selectable");
    container.addEventListener("click", () => selectProject(projectObj));

    return projectObj;
}

function createTodo(entry) {
    const entryCard = document.createElement("div");
    entryCard.classList.add("entry-card");

    const title = document.createElement("h4");
    title.textContent = entry.title;
    console.log("title is" + title.textContent);
    entryCard.append(title);

    const desc = document.createElement("p");
    desc.textContent = entry.desc;
    console.log("desc is" + desc.textContent);
    entryCard.append(desc);

    const dueDate = document.createElement("p");
    dueDate.textContent = entry.dueDate;
    entryCard.append(dueDate);

    const priority = document.createElement("p");
    priority.textContent = entry.priority;
    entryCard.append(priority);

    if (entry.subEntries != null) {
        const subEntriesContainer = document.createElement("div");
        subEntriesContainer.classList.add("sub-entries-container");

        entry.subEntries.forEach(subEntry => {
            const subEntriesCard = document.createElement("div");
            subEntriesCard.classList.add("sub-entry-card");
                
            const subEntryTitle = document.createElement("h5");
            subEntryTitle.textContent = subEntry.title;
            subEntriesCard.append(subEntryTitle);
            console.log("subEntryTtiel = " + subEntryTitle.textContent)
                
            const subEntryDesc = document.createElement("p");
            subEntryDesc.textContent = subEntry.desc;
            subEntriesCard.append(subEntryDesc);
                
            const subEntryDueDate = document.createElement("p");
            subEntryDueDate.textContent = subEntry.dueDate;
            subEntriesCard.append(subEntryDueDate);
                
            const subEntryPriority = document.createElement("p");
            subEntryPriority.textContent = subEntry.priority;
            subEntriesCard.append(subEntryPriority);

            subEntriesContainer.append(subEntriesCard);
        });

        entryCard.append(subEntriesContainer);
    }

    return entryCard;
}

window.addEventListener("click", (event) => {
    const clicked = event.target.closest(".proj-selectable");

    if (!clicked) {
        if (selectedProject != null) {
            deselectAll();
            return;
        }
    }
});

let selectedProject = null;

function selectProject(project) {
    if (project == selectedProject) return;

    if (selectedProject != null) selectedProject.node.classList.remove("proj-selected");

    selectedProject = project;
    
    selectedProject.node.classList.add("proj-selected");

    newTodoForm.classList.remove("form-close");
}

function deselectAll() {
    selectedProject.node.classList.remove("proj-selected");
    selectedProject = null;
    newTodoForm.classList.add("form-close");
}

const newProjForm = document.getElementById("form-new-proj");

const btnNewProject = document.getElementById("form-btn-add-proj");
btnNewProject.addEventListener("click", () => {
    const newProjData = new FormData(newProjForm);
    
    const title = newProjData.get("new-proj-title");
    if (!title || title.trim() === "") {
        alert("Please assign a title for your new project.");
        return;
    }

    addProject(new Builder.Project(
        newProjData.get("new-proj-title"), 
        newProjData.get("new-proj-desc"),
    ));
});

const newTodoForm = document.getElementById("form-new-todo");

const btnNewTodo = document.getElementById("form-btn-add-todo");
btnNewTodo.addEventListener("click", () => {
    if (selectedProject == null) {
        alert("Please select a project to add your todo to.");
        return;
    }

    const newTodoData = new FormData(newTodoForm);
    
    const title = newTodoData.get("new-todo-title");
    if (!title || title.trim() === "") {
        alert("Please assign a title for your todo.");
        return;
    }

    const newEntry = new Builder.TodoEntry(
        title,
        newTodoData.get("new-todo-desc"),
        newTodoData.get("new-todo-due-date"),
        newTodoData.get("new-todo-priority"),
        // subEntries...
    );
    selectedProject.projectRef.addEntry(newEntry);
    selectedProject.entriesDiv.append(createTodo(newEntry));
});

newTodoForm.classList.add("form-close");

