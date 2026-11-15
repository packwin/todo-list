import "./styles.css";
import { ProjectManager, Project, ProjectNodePair, TodoEntry, TodoNodePair } from "./builder.js";

const projManager = new ProjectManager();

// #region Sidebar
const projList = document.getElementById("proj-list");

const formNewProj = document.getElementById("form-new-proj");
formNewProj.classList.add("hidden");

const newProjTitle = document.getElementById("new-proj-title");
newProjTitle.addEventListener("change", updateBtnNewProj);

const btnNewProjClose = document.getElementById("btn-new-proj-close");
btnNewProjClose.addEventListener("click", () => {
    formNewProj.classList.add("hidden");
    updateBtnNewProj();
});

const btnNewProjSubmit = document.getElementById("btn-new-proj");
btnNewProjSubmit.addEventListener("click", () => {
    const formOpen = btnNewProjSubmit.textContent != "New Project";

    formNewProj.classList.remove("hidden");
    updateBtnNewProj();

    if (newProjTitle.value === "") {
        alert("Please give a title for your new project.");
        return;
    }
    if (formOpen) addNewProject(newProjTitle.value);
});

const projInfoTitle = document.getElementById("proj-info-title");
const projInfoDesc = document.getElementById("proj-info-desc");
projInfoDesc.classList.add("hidden");

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

    addTodoCard(new TodoEntry(inputNewTodo.value, inputNewTodoDesc.value, inputNewTodoDate.value, newTodoPriority.value));
});

const todoList = document.getElementById("todo-list");
const todoListCompleted = document.getElementById("todo-list-completed");

window.addEventListener("click", () => {

});

let selectedProj = null;
let selectedTodo = null;

function deselectProjAll() {
    projManager.projects.forEach((proj) => proj.selectBtn.classList.remove("proj-selected"));
    selectedProj = null;
}

function selectProj(proj) {
    deselectProjAll();

    selectedProj = proj;
    proj.selectBtn.classList.add("proj-selected");

    projInfoTitle.textContent = selectedProj.data.title;
    projInfoDesc.value = selectedProj.data.desc === undefined ? projInfoDesc.value : selectedProj.data.desc;
    projInfoDesc.classList.remove("hidden");

    buildProjectTodoCards(selectedProj);
}

function deselectTodoAll() {
    selectedProj.data.entries.forEach((entry) => entry.node.card.classList.remove("todo-selected"));
    selectedTodo = null;
}

function selectTodo(todo) {
    if (!todo instanceof TodoNodePair) {
        throw new TypeError("selectTodo(): todo must be of type \"TodoNodePair\"!");
    }

    deselectTodoAll();

    selectedTodo = todo;
    todo.node.card.classList.add("todo-selected");
}

function updateBtnNewProj() {
    btnNewProjSubmit.textContent = formNewProj.classList.contains("hidden") ? "New Project" : `Add: "${newProjTitle.value}"`;
}

function addNewProject(projTitle) {
    if (projManager.projects.some((proj) => proj.data.title == projTitle)) {
        alert("You already have a project titled: " + projTitle);
        return;
    }

    const projBtn = document.createElement("button");

    const newProj = new ProjectNodePair(new Project(projTitle), projBtn);

    projBtn.classList.add("btn-proj-switch");
    projBtn.textContent = projTitle;
    projBtn.addEventListener("click", () => {
        selectProj(newProj);
    });

    projList.append(projBtn);

    projManager.addProject(newProj);

    selectProj(newProj);
}

function addTodoCard(todoEntry) {
    selectedProj.data.addEntry(makeTodoNodePair(todoEntry, createTodoCard(todoEntry)));
}

function makeTodoNodePair(data, node) {
    const newTodo = new TodoNodePair(data, node);

    newTodo.node.card.addEventListener("click", () => {
        selectTodo(newTodo);
    })    

    newTodo.node.checkbox.addEventListener("change", () => {
        const complete = newTodo.node.checkbox.checked;
        newTodo.data.completed = complete;
        newTodo.node.card.classList.toggle("todo-completed", complete);

        if (complete) {
            todoListCompleted.append(newTodo.node.card);
            todoListCompleted.classList.remove("hidden");

            newTodo.node.title.contentEditable = false;
            newTodo.node.desc.contentEditable = false;
        }
        else {
            todoList.append(newTodo.node.card);
            
            newTodo.node.title.contentEditable = true;
            newTodo.node.desc.contentEditable = true;

            if (todoListCompleted.childElementCount <= 1) {
                todoListCompleted.classList.add("hidden");
            }
        }
    });

    return newTodo;
}

function createTodoCard(todoEntry) {
    const card = document.createElement("div");
    card.classList.add("todo-card");

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
    title.textContent = todoEntry.title;
    title.classList.add("todo-card-title");
    title.contentEditable = true;
    headerDiv.append(title);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("todo-card-info");
    headerAndInfoDiv.append(infoDiv);

    const desc = document.createElement("p");
    desc.textContent = todoEntry.desc;
    desc.classList.add("todo-card-desc");
    desc.contentEditable = true;
    card.append(desc);

    const dueDate = document.createElement("p");
    dueDate.textContent = todoEntry.dueDate;
    dueDate.classList.add("todo-card-due-date");
    infoDiv.append(dueDate);

    const priority = document.createElement("p");
    priority.classList.add("todo-card-priority");
    if (todoEntry.priority == "none" || todoEntry.priority == "") {
        priority.classList.add("hidden");
    } else {
        const priorityText = todoEntry.priority.charAt(0).toUpperCase() + todoEntry.priority.slice(1);
        priority.textContent = priorityText;
    
        switch(todoEntry.priority) {
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
                console.log("DEFAULDTEULDFAFLUT");
                console.log(priority)
                break;
        }
    } 

    infoDiv.append(priority);
    
    const cardObj = {
        card: card,
        checkbox: checkbox,
        title: title,
        desc: desc,
        dueDate: dueDate,
        priority: priority,
    };

    todoList.append(card);

    btnNewTodoDate.textContent = "Due Date";
    newTodoPriority.selectedIndex = 0;
    inputNewTodo.value = "";
    inputNewTodoDesc.value = "";

    return cardObj;
}

function buildProjectTodoCards(proj) {
    // clear previously open project and build current open project's todo cards
    todoList.replaceChildren();
    const todoListCompletedSummary = todoListCompleted.querySelector("summary");
    todoListCompleted.replaceChildren();

    todoListCompleted.append(todoListCompletedSummary);
    proj.data.entries.forEach((todo) => {
        if(!todo.data.completed) 
            todoList.append(todo.node.card);
        else
            todoListCompleted.append(todo.node.card);
    });

    if (todoListCompleted.childElementCount <= 1) {
        todoListCompleted.classList.add("hidden");
    }
    else {
        todoListCompleted.classList.remove("hidden");
    }
}