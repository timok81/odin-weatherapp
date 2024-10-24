import { dataBase, saveData } from "./createtask";
import { submitTask, submitProject, editProject, editTask } from "./navmenu";
import projectImage from "./images/folder-open.svg";
import completeProjectImage from "./images/check-bold.svg";
import categoryTodayImage from "./images/calendar.svg";
import categoryWeekImage from "./images/calendar-week.svg";
import editImage from "./images/pencil.svg";
import addImage from "./images/plus-circle.svg";
import deleteImage from "./images/delete.svg";
import { isSameISOWeek } from "date-fns";

const taskModal = document.querySelector(".createtaskmodal");
const projectModal = document.querySelector(".createprojectmodal");
const addProjectButton = document.querySelector(".addproject");
const addTaskButton = document.querySelector(".addtask");
const submitTaskButton = document.querySelector(".newtasksubmit");
const closeNewTaskButton = document.querySelector(".newtaskclose");
const submitProjectButton = document.querySelector(".newprojectsubmit");
const closeNewProjectButton = document.querySelector(".newprojectclose");

//Renders basic menu elements
function setupMenu() {
  if (
    dataBase.getProjects().filter((project) => project.isCategory === 0)
      .length > 0
  ) {
    addTaskButton.classList.remove("addtaskdisabled");
    addTaskButton.classList.add("addtask");
    addTaskButton.setAttribute("title", "Create a new task");
    addTaskButton.addEventListener("click", openTaskModal);
  } else if (
    dataBase.getProjects().filter((project) => project.isCategory === 0)
      .length === 0
  ) {
    addTaskButton.removeAttribute("class", "addtask");
    addTaskButton.classList.add("addtaskdisabled");
    addTaskButton.setAttribute(
      "title",
      "Tasks can only be created when at least one project is available"
    );
    addTaskButton.removeEventListener("click", openTaskModal);
  }
  submitTaskButton.addEventListener("click", submitTask);
  closeNewTaskButton.addEventListener("click", () => taskModal.close());

  addProjectButton.addEventListener("click", () => projectModal.show());
  submitProjectButton.addEventListener("click", submitProject);
  closeNewProjectButton.addEventListener("click", () => projectModal.close());
}

function openTaskModal() {
  taskModal.showModal();
}

//Renders all nav menu items based on projects array from dataBase
function renderMenu(projects = []) {
  const taskList = document.querySelector("#tasklist");
  const projectList = document.querySelector("#projectlist");
  const completedProjectsList = document.querySelector(
    "#completedprojectslist"
  );
  const currentProjectItems = document.querySelectorAll(".projectitem");

  currentProjectItems.forEach((element) => {
    element.remove();
  });

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].isCategory === 0) {
      const projectItem = document.createElement("button");
      if (projects[i].complete === 0) {
        projectList.appendChild(projectItem);
      } else if (projects[i].complete === 1) {
        completedProjectsList.appendChild(projectItem);
      }
      projectItem.classList.add("projectitem");
      if (projects[i].complete === 0) {
        const projectIcon = projectItem.appendChild(
          document.createElement("img")
        );
        projectIcon.src = projectImage;
        projectIcon.setAttribute("width", "25px");
      } else if (projects[i].complete === 1) {
        const projectIcon = projectItem.appendChild(
          document.createElement("img")
        );
        projectIcon.src = completeProjectImage;
        projectIcon.setAttribute("width", "25px");
      }
      const projectItemText = projectItem.appendChild(
        document.createElement("p")
      );
      projectItemText.textContent = projects[i].name;

      projectItem.addEventListener("click", function () {
        renderContent(projects[i]);
      });
    } else if (projects[i].isCategory === 1 || projects[i].isCategory === 2) {
      const categoryItem = taskList.appendChild(
        document.createElement("button")
      );
      categoryItem.classList.add("projectitem");
      const categoryIcon = categoryItem.appendChild(
        document.createElement("img")
      );
      if (projects[i].isCategory === 1) {
        categoryIcon.src = categoryTodayImage;
      } else if (projects[i].isCategory === 2) {
        categoryIcon.src = categoryWeekImage;
      }
      categoryIcon.setAttribute("width", "25px");
      const categoryItemText = categoryItem.appendChild(
        document.createElement("p")
      );
      categoryItemText.textContent = projects[i].name;

      categoryItem.addEventListener("click", function () {
        renderContent(projects[i]);
      });
    }
  }
}

//Adds new project option to task creation form
function updateForms() {
  const projectOptions = document.querySelector("#projectoptions");
  const oldProjectOptions = projectOptions.querySelectorAll("option");
  oldProjectOptions.forEach((element) => {
    element.remove();
  });
  for (let i = 0; i < dataBase.getProjects().length; i++) {
    if (dataBase.getProjects()[i].isCategory === 0) {
      const projectOptions = document.querySelector("#projectoptions");
      const newProjectOption = projectOptions.appendChild(
        document.createElement("option")
      );
      newProjectOption.setAttribute("value", dataBase.getProjects()[i].name);
      newProjectOption.textContent = dataBase.getProjects()[i].name;
    }
  }
  saveData();
}

//Sets project as auto-selected for task creation form
function setDefaultProject(projectName) {
  const allOptions = document
    .querySelector("#projectoptions")
    .querySelectorAll("option");
  allOptions.forEach((element) => {
    if (element.value === projectName) {
      element.setAttribute("selected", "true");
    } else {
      element.removeAttribute("selected", "false");
    }
  });
  saveData();
}

//Opens the task creation form and sets current project as default selection
function showTaskCreationForm(projectName) {
  updateForms();
  setDefaultProject(projectName);
  taskModal.showModal();
}

function clearContent() {
  const oldContent = document.querySelector("#content");
  oldContent.remove();
  const content = document.createElement("div");
  document.body.appendChild(content);
  content.id = "content";
}

//Renders project's data to content div
function renderContent(project) {
  clearContent();
  const content = document.querySelector("#content");
  const projectHeader = content.appendChild(document.createElement("div"));
  projectHeader.classList.add("projectheader");
  const projectHeaderText = projectHeader.appendChild(
    document.createElement("h2")
  );
  projectHeaderText.textContent = project.name;

  const editProjectButton = projectHeader.appendChild(
    document.createElement("img")
  );
  editProjectButton.src = editImage;
  editProjectButton.setAttribute("width", "25px");
  editProjectButton.classList.add("editbutton");
  editProjectButton.setAttribute("title", "Edit project");
  editProjectButton.addEventListener("click", function () {
    openEditProjectModal(project);
  });

  const deleteProjectButton = projectHeader.appendChild(
    document.createElement("img")
  );
  deleteProjectButton.src = deleteImage;
  deleteProjectButton.setAttribute("width", "25px");
  deleteProjectButton.classList.add("deletebutton");
  deleteProjectButton.setAttribute("title", "Delete project");
  deleteProjectButton.addEventListener("click", function () {
    deleteProject(project);
  });

  const projectDescription = content.appendChild(document.createElement("div"));
  projectDescription.classList.add("projectdescription");
  projectDescription.textContent = project.description;

  const projectTaskList = content.appendChild(document.createElement("div"));
  projectTaskList.classList.add("projecttasklist");
  const tasksHeader = projectTaskList.appendChild(
    document.createElement("div")
  );
  tasksHeader.classList.add("tasksheader");

  const addTaskButton = tasksHeader.appendChild(
    document.createElement("button")
  );
  addTaskButton.classList.add("addtaskbutton");
  addTaskButton.setAttribute("title", "Add new task");

  const addTaskIcon = addTaskButton.appendChild(document.createElement("img"));
  addTaskIcon.src = addImage;

  addTaskButton.addEventListener("click", function () {
    showTaskCreationForm(project.name);
  });

  const tasksColumnTitle = tasksHeader.appendChild(
    document.createElement("h3")
  );
  tasksColumnTitle.classList.add("taskscolumntitle");
  tasksColumnTitle.textContent = "Tasks";
  const dueDateColumnTitle = tasksHeader.appendChild(
    document.createElement("h3")
  );
  dueDateColumnTitle.classList.add("duedatecolumntitle");
  dueDateColumnTitle.textContent = "Due";

  //Create task for normal project
  if (project.isCategory === 0) {
    for (let i = 0; i < project.tasks.length; i++) {
      createTaskForList(projectTaskList, project.tasks[i], project);
    }
  }
  //Create task for category today
  else if (project.isCategory === 1) {
    const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate()}`;

    for (let i = 0; i < dataBase.getProjects().length; i++) {
      for (let j = 0; j < dataBase.getProjects()[i].tasks.length; j++) {
        if (dataBase.getProjects()[i].tasks[j].duedate === todayDate) {
          createTaskForList(
            projectTaskList,
            dataBase.getProjects()[i].tasks[j],
            project
          );
        }
      }
    }
  }
  //Create task for category week
  else if (project.isCategory === 2) {
    const date = new Date();
    const todayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate()}`;

    for (let i = 0; i < dataBase.getProjects().length; i++) {
      for (let j = 0; j < dataBase.getProjects()[i].tasks.length; j++) {
        if (
          isSameISOWeek(dataBase.getProjects()[i].tasks[j].duedate, todayDate)
        ) {
          createTaskForList(
            projectTaskList,
            dataBase.getProjects()[i].tasks[j],
            project
          );
        }
      }
    }
  }

  if (project.isCategory === 0) {
    const projectCheckBoxContainer = content.appendChild(
      document.createElement("div")
    );
    projectCheckBoxContainer.classList.add("projectcheckboxcontainer");

    const projectCheckBox = projectCheckBoxContainer.appendChild(
      document.createElement("input")
    );
    projectCheckBox.setAttribute("type", "checkbox");
    projectCheckBox.setAttribute("name", "projectcheckbox");
    projectCheckBox.setAttribute("id", "projectcheckbox");

    projectCheckBox.checked = project.complete;
    projectCheckBox.classList.add("projectcheckbox");

    projectCheckBox.addEventListener("click", function () {
      toggleProjectComplete(project);
    });

    const projectCheckBoxLabel = projectCheckBoxContainer.appendChild(
      document.createElement("label")
    );
    projectCheckBoxLabel.setAttribute("for", "projectcheckbox");
    projectCheckBoxLabel.classList.add("projectcheckboxlabel");
    projectCheckBoxLabel.textContent = "Toggle project complete";
  }
}

//Creates task DOM elements for each task
function createTaskForList(projectTaskList, task, project) {
  const taskListTask = projectTaskList.appendChild(
    document.createElement("div")
  );
  taskListTask.classList.add("tasklisttask");
  taskListTask.id = "minimizedtask";

  const taskCheckBox = taskListTask.appendChild(
    document.createElement("input")
  );
  taskCheckBox.setAttribute("type", "checkbox");
  taskCheckBox.setAttribute("name", "taskcheckbox");
  taskCheckBox.setAttribute("id", "taskcheckbox");
  taskCheckBox.classList.add("taskcheckbox");
  taskCheckBox.checked = task.complete;

  taskCheckBox.addEventListener("click", function () {
    toggleTaskComplete(task);
  });

  const taskListTaskName = taskListTask.appendChild(
    document.createElement("button")
  );
  taskListTaskName.classList.add("tasklisttaskname");
  if (task.priority === "High") {
    taskListTaskName.classList.add("highpriority");
  }
  if (task.priority === "Low") {
    taskListTaskName.classList.add("lowpriority");
  }
  taskListTaskName.textContent = task.name;

  taskListTaskName.addEventListener("click", function () {
    toggleTaskSize(taskListTask, task, task.priority, task.description);
  });

  const taskDueDate = taskListTask.appendChild(document.createElement("p"));
  taskDueDate.classList.add("taskduedate");
  taskDueDate.textContent = task.duedate;

  const editTaskButton = taskListTask.appendChild(
    document.createElement("img")
  );
  editTaskButton.classList.add("editbutton");
  editTaskButton.src = editImage;
  editTaskButton.setAttribute("title", "Edit task");
  editTaskButton.setAttribute("width", "25px");

  editTaskButton.addEventListener("click", function () {
    openEditTaskModal(task, project);
  });

  const deleteTaskButton = taskListTask.appendChild(
    document.createElement("img")
  );
  deleteTaskButton.src = deleteImage;
  deleteTaskButton.classList.add("deletebutton");
  deleteTaskButton.setAttribute("title", "Delete task");
  deleteTaskButton.setAttribute("width", "25px");

  deleteTaskButton.addEventListener("click", function () {
    deleteTask(task, project);
  });
}

//Logic for expanding and minimizing tasks
function toggleTaskSize(task, actualTask, priority, description) {
  if (task.id === "minimizedtask") {
    task.style.height = "300px";
    task.classList.add("tasklisttask-expanded");
    task.id = "maximizedtask";

    const taskPriority = task.appendChild(document.createElement("div"));
    taskPriority.classList.add("tasklisttask-priority");
    taskPriority.textContent = `Priority: ${priority}`;

    const taskDescription = task.appendChild(
      document.createElement("textarea")
    );
    taskDescription.classList.add("tasklisttask-description");
    taskDescription.setAttribute("name", "taskdescription");
    taskDescription.textContent = description;
  } else {
    const tPriority = task.querySelector(".tasklisttask-priority");
    tPriority.remove();
    const tDescription = task.querySelector(".tasklisttask-description");
    actualTask.description = tDescription.value;
    tDescription.remove();
    task.style.height = "50px";
    task.id = "minimizedtask";
    task.classList.remove("tasklisttask-expanded");
  }
}

function toggleTaskComplete(task) {
  if (task.complete === 0) {
    task.complete = 1;
  } else {
    task.complete = 0;
  }
  saveData();
}

function toggleProjectComplete(project) {
  if (project.complete === 0) {
    project.complete = 1;
  } else {
    project.complete = 0;
  }
  saveData();
  renderMenu(dataBase.getProjects());
}

function deleteProject(project) {
  dataBase.deleteProject(dataBase.getProjects().indexOf(project));
  renderMenu(dataBase.getProjects());
  clearContent();
  updateForms();
  setupMenu();
}

function deleteTask(task, project) {
  const projectIndex = dataBase.getProjects().indexOf(project);
  const taskIndex = dataBase.getProjects()[projectIndex].tasks.indexOf(task);
  dataBase.getProjects()[projectIndex].deleteTask(taskIndex);
  renderContent(project);
}

function createEditProjectModal(project) {
  const editProjectDialog = document.createElement("dialog");
  editProjectDialog.classList.add("editprojectmodal");
  document.body.appendChild(editProjectDialog);
  const header = editProjectDialog.appendChild(document.createElement("h1"));
  header.textContent = "Edit Project";
  const formcontainer = editProjectDialog.appendChild(
    document.createElement("div")
  );
  formcontainer.classList.add("formcontainer");
  const projectEditForm = formcontainer.appendChild(
    document.createElement("form")
  );
  projectEditForm.classList.add("editprojectform");
  const editProjectNameContainer = projectEditForm.appendChild(
    document.createElement("div")
  );
  editProjectNameContainer.classList.add("form-row");
  const editNameLabel = editProjectNameContainer.appendChild(
    document.createElement("label")
  );
  editNameLabel.setAttribute("for", "name");
  editNameLabel.textContent = "Project name: ";
  const editNameField = editProjectNameContainer.appendChild(
    document.createElement("input")
  );
  editNameField.type = "text";
  editNameField.id = "name";
  editNameField.name = "name";
  editNameField.value = project.name;
  const editProjectDescContainer = projectEditForm.appendChild(
    document.createElement("div")
  );
  editProjectDescContainer.classList.add("form-row");
  const editoDescLabel = editProjectDescContainer.appendChild(
    document.createElement("label")
  );
  editoDescLabel.setAttribute("for", "description");
  editoDescLabel.textContent = "Project description: ";
  const editDescField = editProjectDescContainer.appendChild(
    document.createElement("textarea")
  );
  editDescField.id = "description";
  editDescField.name = "description";
  editDescField.value = project.description;
  const editProjectButtonContainer = projectEditForm.appendChild(
    document.createElement("div")
  );
  editProjectButtonContainer.classList.add("buttonsarea");
  const submitButton = editProjectButtonContainer.appendChild(
    document.createElement("button")
  );
  submitButton.type = "submit";
  submitButton.classList.add("editprojectsubmit");
  submitButton.textContent = "Submit edit";
  submitButton.addEventListener("click", function (e) {
    editProject(e, project);
  });
  const closeButton = editProjectButtonContainer.appendChild(
    document.createElement("button")
  );
  closeButton.type = "button";
  closeButton.classList.add("editprojectclose");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => editProjectDialog.close());
}

function openEditProjectModal(project) {
  createEditProjectModal(project);
  const editProjectModal = document.querySelector(".editprojectmodal");
  editProjectModal.show();
}

function createEditTaskModal(task, project) {
  const editTaskDialog = document.createElement("dialog");
  editTaskDialog.classList.add("edittaskmodal");
  document.body.appendChild(editTaskDialog);
  const header = editTaskDialog.appendChild(document.createElement("h1"));
  header.textContent = "Edit Task";
  const formcontainer = editTaskDialog.appendChild(
    document.createElement("div")
  );
  formcontainer.classList.add("formcontainer");
  const taskEditForm = formcontainer.appendChild(
    document.createElement("form")
  );
  taskEditForm.classList.add("edittaskform");
  const editTaskNameContainer = taskEditForm.appendChild(
    document.createElement("div")
  );
  editTaskNameContainer.classList.add("form-row");
  const editNameLabel = editTaskNameContainer.appendChild(
    document.createElement("label")
  );
  editNameLabel.setAttribute("for", "name");
  editNameLabel.textContent = "Task name: ";
  const editNameField = editTaskNameContainer.appendChild(
    document.createElement("input")
  );
  editNameField.type = "text";
  editNameField.id = "name";
  editNameField.name = "name";
  editNameField.value = task.name;
  const editdueDateContainer = taskEditForm.appendChild(
    document.createElement("div")
  );
  editdueDateContainer.classList.add("form-row");
  const editDueDateLabel = editdueDateContainer.appendChild(
    document.createElement("label")
  );
  editDueDateLabel.setAttribute("for", "duedate");
  editDueDateLabel.textContent = "Due date: ";
  const editDueDate = editdueDateContainer.appendChild(
    document.createElement("input")
  );
  editDueDate.type = "date";
  editDueDate.id = "duedate";
  editDueDate.name = "duedate";
  editDueDate.value = task.duedate;
  const editPriorityContainer = taskEditForm.appendChild(
    document.createElement("div")
  );
  editPriorityContainer.classList.add("form-row");
  const editPriorityLabel = editPriorityContainer.appendChild(
    document.createElement("label")
  );
  editPriorityLabel.setAttribute("for", "priority");
  editPriorityLabel.textContent = "Task priority: ";
  const editPriority = editPriorityContainer.appendChild(
    document.createElement("select")
  );
  editPriority.id = "priority";
  editPriority.name = "priority";
  const priorityOptionHigh = editPriority.appendChild(
    document.createElement("option")
  );
  priorityOptionHigh.value = "High";
  priorityOptionHigh.textContent = "High";
  const priorityOptionMedium = editPriority.appendChild(
    document.createElement("option")
  );
  priorityOptionMedium.value = "Medium";
  priorityOptionMedium.textContent = "Medium";
  const priorityOptionLow = editPriority.appendChild(
    document.createElement("option")
  );
  priorityOptionLow.value = "Low";
  priorityOptionLow.textContent = "Low";
  if (task.priority === "High") {
    priorityOptionHigh.setAttribute("selected", "true");
  } else if (task.priority === "Medium") {
    priorityOptionMedium.setAttribute("selected", "true");
  } else if (task.priority === "Low") {
    priorityOptionLow.setAttribute("selected", "true");
  }
  const editTaskDescContainer = taskEditForm.appendChild(
    document.createElement("div")
  );
  editTaskDescContainer.classList.add("form-row");
  const editoDescLabel = editTaskDescContainer.appendChild(
    document.createElement("label")
  );
  editoDescLabel.setAttribute("for", "description");
  editoDescLabel.textContent = "Task description: ";
  const editDescField = editTaskDescContainer.appendChild(
    document.createElement("textarea")
  );
  editDescField.id = "description";
  editDescField.name = "description";
  editDescField.value = task.description;
  const editTaskButtonContainer = taskEditForm.appendChild(
    document.createElement("div")
  );
  editTaskButtonContainer.classList.add("buttonsarea");
  const submitButton = editTaskButtonContainer.appendChild(
    document.createElement("button")
  );
  submitButton.type = "submit";
  submitButton.classList.add("edittasksubmit");
  submitButton.textContent = "Submit edit";
  submitButton.addEventListener("click", function (e) {
    editTask(e, task, project);
  });
  const closeButton = editTaskButtonContainer.appendChild(
    document.createElement("button")
  );
  closeButton.type = "button";
  closeButton.classList.add("edittaskclose");
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", () => editTaskDialog.close());
}

function openEditTaskModal(task, project) {
  createEditTaskModal(task, project);
  const editTaskModal = document.querySelector(".edittaskmodal");
  editTaskModal.show();
}

export { setupMenu, renderMenu, renderContent, updateForms, setDefaultProject };
