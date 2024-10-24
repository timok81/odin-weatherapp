import { dataBase, saveData } from "./createtask";
import { renderContent, renderMenu, setupMenu } from "./dom";

function submitTask(e) {
  const taskModal = document.querySelector(".createtaskmodal");
  const form = document.querySelector(".newtaskform");

  const name = form.elements.name.value;
  const dueDate = form.elements.duedate.value;
  const priority = form.elements.priority.value;
  const description = form.elements.description.value;
  const project = form.elements.project.value;

  let projectIndex = 0;
  for (let i = 0; i < dataBase.getProjects().length; i++) {
    if (dataBase.getProjects()[i].name === project) {
      projectIndex = i;
    }
  }
  const targetProject = dataBase.getProject(projectIndex);
  e.preventDefault();
  targetProject.addTask(name, dueDate, priority, description, projectIndex);
  renderContent(targetProject);
  renderMenu(dataBase.getProjects());
  taskModal.close();
}

function submitProject(e) {
  const projectModal = document.querySelector(".createprojectmodal");
  const form = document.querySelector(".newprojectform");

  const name = form.elements.name.value;
  const description = form.elements.description.value;
  e.preventDefault();
  dataBase.addProject(name, description);
  renderMenu(dataBase.getProjects());
  setupMenu();
  projectModal.close();
}

function editProject(e, project) {
  const editProjectModal = document.querySelector(".editprojectmodal");
  const form = document.querySelector(".editprojectform");

  const name = form.elements.name.value;
  const description = form.elements.description.value;
  e.preventDefault();
  project.name = name;
  project.description = description;
  saveData();
  renderContent(project);
  renderMenu(dataBase.getProjects());
  setupMenu();
  editProjectModal.close();
}

function editTask(e, task, project) {
  const editTaskModal = document.querySelector(".edittaskmodal");
  const form = document.querySelector(".edittaskform");

  const name = form.elements.name.value;
  const description = form.elements.description.value;
  const priority = form.elements.priority.value;
  const dueDate = form.elements.duedate.value;
  e.preventDefault();
  task.name = name;
  task.description = description;
  task.priority = priority;
  task.duedate = dueDate;
  saveData();
  renderContent(project);
  editTaskModal.close();
}

export { submitTask, submitProject, editProject, editTask };
