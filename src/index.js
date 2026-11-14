import "./styles.css";
import { Builder } from "./builder.js";

const manager = new Builder.ProjectManager();

// Containers
const projectsSelection = document.getElementById("projects-selection");
const selectedProjInfo = document.getElementById("selected-proj-info");
const todos = document.getElementById("todos");

// Forms
const newProjForm = document.getElementById("form-new-proj");
const btnNewProject = document.getElementById("form-btn-add-proj");

const newTodoForm = document.getElementById("form-new-todo");
const btnNewTodo = document.getElementById("form-btn-add-todo");


let selectedProject = null;
let selectedTodo = null;

window.addEventListener("click", (event) => {
    if (!event.target.closest(".todo-selectable") 
        && !event.target.closest("#form-new-todo")
        && !event.target.closest("#form-new-proj")) {
        deselectAll();
    }
});

btnNewProject.addEventListener("click", () => {
    const newProjData = new FormData(newProjForm);
    
    const title = newProjData.get("new-proj-title");
    if (!title || title.trim() === "") {
        alert("Please assign a title for your new project.");
        return;
    }

    addProjectCard(new Builder.Project(
        newProjData.get("new-proj-title"), 
        newProjData.get("new-proj-desc"),
    ));
});

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
    todos.append(createTodo(newEntry));
});

function addProjectCard(projectObj) {
    const projectCard = createProjectContainer(projectObj);

    manager.addProject(projectObj);

    const projectSelectBtn = document.createElement("button");
    projectSelectBtn.textContent = projectCard.title.textContent;
    projectSelectBtn.classList.add("proj-btn-select");
    projectSelectBtn.addEventListener("click", () => {
        selectProject(projectCard);
    });
    projectsSelection.append(projectSelectBtn);

    selectProject(projectCard);
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

    const projectObj = {
        node: container, 
        title: header, 
        desc: subtitle,
        projectRef: project,
    };

    return projectObj;
}

function createTodo(entry) {
    const entryCard = document.createElement("div");
    entryCard.classList.add("entry-card");

    entryCard.classList.add("todo-selectable");
    entryCard.addEventListener("click", () => selectTodo(entryCard));

    const title = document.createElement("h4");
    title.textContent = entry.title;
    entryCard.append(title);

    const desc = document.createElement("p");
    desc.textContent = entry.desc;
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

function selectProject(project) {
    if (project === selectedProject) return;
    if (selectedProject != null) selectedProject.node.classList.remove("proj-selected");

    selectedProject = project;
    selectedProject.node.classList.add("proj-selected");
    showProject(project);
}

function showProject(project) {
    selectedProjInfo.replaceChildren();
    todos.replaceChildren();

    // add project title and description
    selectedProjInfo.append(project.node);

    // build todo list entries
    project.projectRef.entries.forEach((entry) => {
        todos.append(createTodo(entry));
    });

    newTodoForm.classList.remove("form-close");
} 

function selectTodo(todoEntry) {
    if (todoEntry === selectedTodo) return;
    if (selectedTodo != null) selectedTodo.classList.remove("todo-selected");

    selectedTodo = todoEntry;
    selectedTodo.classList.add("todo-selected");
}

function deselectAll() {
    if (selectedTodo != null) selectedTodo.classList.remove("todo-selected");
    selectedTodo = null;
}