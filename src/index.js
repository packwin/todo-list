import "./styles.css";
import { ProjectManager, Project, TodoEntry } from "./builder.js";

const projManager = ProjectManager.load();

const cardsByEntry = new Map();

// #region Sidebar
const projList = document.getElementById("proj-list");

const formNewProj = document.getElementById("form-new-proj");
formNewProj.classList.add("hidden");

const newProjTitle = document.getElementById("new-proj-title");
newProjTitle.addEventListener("input", updateBtnNewProj);

const btnNewProjClose = document.getElementById("btn-new-proj-close");
btnNewProjClose.addEventListener("click", () => {
    formNewProj.classList.add("hidden");
    // updateBtnNewProj();
    btnNewProjSubmit.textContent = "New Project";
});

const btnNewProjSubmit = document.getElementById("btn-new-proj");
btnNewProjSubmit.addEventListener("click", () => {
    const formOpen = btnNewProjSubmit.textContent != "New Project";

    formNewProj.classList.remove("hidden");
    updateBtnNewProj();

    
    if (formOpen) {
        if (newProjTitle.value === "") {
            alert("Please give a title for your new project.");
            return;
        }
        addNewProject(newProjTitle.value);
    }
});

const projInfoTitle = document.getElementById("proj-info-title");
projInfoTitle.addEventListener("input", () => {
    if (selectedProj) {
        selectedProj.title = projInfoTitle.value;
        projManager.save();
        buildProjectButtons();
    }
});
const projInfoDesc = document.getElementById("proj-info-desc");
projInfoDesc.classList.add("hidden");
projInfoDesc.addEventListener("input", () => {
    if (selectedProj) {
        selectedProj.desc = projInfoDesc.value;
        projManager.save();
    }
});

// #endregion

const inputNewTodoDate = document.getElementById("input-new-todo-date");
const btnNewTodoDate = document.getElementById("btn-new-todo-date");
btnNewTodoDate.addEventListener("click", () => inputNewTodoDate.showPicker());
inputNewTodoDate.addEventListener("change", () => btnNewTodoDate.textContent = inputNewTodoDate.value);

const newTodoPriority = document.getElementById("new-todo-priority-select");

const inputNewTodo = document.getElementById("input-new-todo");
const inputNewTodoDesc = document.getElementById("input-new-todo-desc");

const btnNewTodo = document.getElementById("btn-new-todo");
btnNewTodo.addEventListener("click", () => {
    if (inputNewTodo.value === "") {
        alert("Please add a title for your todo entry.");
        return;
    }

    if (projManager.projects.length === 0) {
        alert("Please add a project.");
        return;
    }

    if (selectedProj == null) {
        alert("Please select a project.");
        return;
    }

    const newTodo = new TodoEntry(
        inputNewTodo.value,
        inputNewTodoDesc.value,
        inputNewTodoDate.value,
        newTodoPriority.value
    );

    selectedProj.addEntry(newTodo);
    projManager.save();
    buildTodoCards();

    btnNewTodoDate.textContent = "Due Date";
    inputNewTodoDate.value = "";
    newTodoPriority.selectedIndex = 0;
    inputNewTodo.value = "";
    inputNewTodoDesc.value = "";
});

const todoList = document.getElementById("todo-list");
const todoListCompleted = document.getElementById("todo-list-completed");
const todoListCompletedDetails = document.getElementById("todo-list-completed-details");

window.addEventListener("click", (e) => {
    if (e.target.closest(".todo-card")) return;
    cardsByEntry.get(selectedTodo)?.classList.remove("todo-selected");
    selectedTodo = null;
    localStorage.setItem("selectedTodoIndex", -1);
});

let selectedProj = null;
let selectedTodo = null;


function selectProj(proj) {
    selectedProj = proj;
    localStorage.setItem("selectedProjIndex", projManager.projects.indexOf(proj));

    selectedTodo = null;
    localStorage.setItem("selectedTodoIndex", -1);

    projInfoTitle.value = selectedProj.title;
    projInfoDesc.value = selectedProj.desc ?? "";
    projInfoDesc.classList.remove("hidden");

    buildTodoCards();
    buildProjectButtons();
}
function selectTodo(entry) {
    cardsByEntry.get(selectedTodo)?.classList.remove("todo-selected");
    selectedTodo = entry;
    cardsByEntry.get(entry)?.classList.add("todo-selected");
    localStorage.setItem("selectedTodoIndex", selectedProj.entries.indexOf(entry));
}

function updateBtnNewProj() {
    // btnNewProjSubmit.textContent = formNewProj.classList.contains("hidden") ? "New Project" : `Add: "${newProjTitle.value}"`;
    btnNewProjSubmit.textContent = "Add Project";
}

function addNewProject(projTitle) {
    if (projManager.projects.some((proj) => proj.title == projTitle)) {
        alert("You already have a project titled: " + projTitle);
        return;
    }

    const newProj = new Project(projTitle);
    projManager.addProject(newProj);
    projManager.save();

    selectProj(newProj);
}

function createTodoCard(entry) {
    const card = document.createElement("div");
    card.classList.add("todo-card");
    card.classList.toggle("todo-completed", entry.completed);
    card.classList.toggle("todo-selected", entry === selectedTodo);
    card.addEventListener("click", () => {
        if (selectedTodo !== entry) selectTodo(entry);
    });
    card.addEventListener("focusin", () => {
        if (selectedTodo !== entry) selectTodo(entry);
    })

    const headerAndInfoDiv = document.createElement("div");
    headerAndInfoDiv.classList.add("todo-card-header-info");
    card.append(headerAndInfoDiv);

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("todo-card-header");
    headerAndInfoDiv.append(headerDiv);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    headerDiv.append(checkbox);

    const title = document.createElement("h3");
    title.textContent = entry.title;
    title.classList.add("todo-card-title");
    title.contentEditable = true;
    headerDiv.append(title);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("todo-card-info");
    headerAndInfoDiv.append(infoDiv);

    const desc = document.createElement("p");
    desc.textContent = entry.desc;
    desc.classList.add("todo-card-desc");
    desc.contentEditable = true;
    card.append(desc);

    const dueDate = document.createElement("p");
    dueDate.textContent = entry.dueDate;
    dueDate.classList.add("todo-card-due-date");
    infoDiv.append(dueDate);

    const priority = document.createElement("p");
    priority.classList.add("todo-card-priority");
    if (entry.priority == "none" || entry.priority == "") {
        priority.classList.add("hidden");
    } else {
        const priorityText = entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1);
        priority.textContent = priorityText;
    
        switch(entry.priority) {
            case "critical":
                priority.classList.add("todo-card-prio-crit");
                break;
            case "high":
                priority.classList.add("todo-card-prio-high");
                break;
            case "moderate":
                priority.classList.add("todo-card-prio-mod");
                break;
            case "low":
                priority.classList.add("todo-card-prio-low");
                break;
            default:
                console.log("todoEntry priority switch has defaulted.");
                break;
        }
    } 
    infoDiv.append(priority);
    
    checkbox.checked = entry.completed;
    checkbox.addEventListener("change", () => {
        entry.completed = checkbox.checked;
        projManager.save();
        buildTodoCards();
    });
    title.addEventListener("input", () => {
        entry.title = title.textContent;
        projManager.save();
    });
    desc.addEventListener("input", () => {
        entry.desc = desc.textContent;
        projManager.save();
    });

    return card;
}

function buildTodoCards() {
    // clear previously open project and build current open project's todo cards
    cardsByEntry.clear();
    
    todoList.replaceChildren();
    todoListCompleted.replaceChildren();

    selectedProj.entries.forEach((entry) => {
        const card = createTodoCard(entry);
        cardsByEntry.set(entry, card);
        (entry.completed ? todoListCompleted : todoList).append(card);
    });

    if (todoListCompleted.childElementCount <= 0) {
        todoListCompletedDetails.classList.add("hidden");
    }
    else {
        todoListCompletedDetails.classList.remove("hidden");
    }
}

function buildProjectButtons() {
    projList.replaceChildren(...projManager.projects.map((proj) => {
        const btn = document.createElement("button");
        btn.classList.add("btn-proj-switch");
        btn.classList.toggle("proj-selected", proj === selectedProj);
        btn.textContent = proj.title;
        btn.addEventListener("click", () => selectProj(proj))
        return btn;
    }));
}

function start() {
    buildProjectButtons();

    const projIndex = Number(localStorage.getItem("selectedProjIndex"));
    const todoIndex = localStorage.getItem("selectedTodoIndex");

    const startProj = projManager.projects[projIndex] ?? projManager.projects[0];
    if (!startProj) return;
    selectProj(startProj);

    const startTodo = todoIndex === null ? undefined : selectedProj?.entries[Number(todoIndex)];
    if (startTodo) selectTodo(startTodo);
}

start();