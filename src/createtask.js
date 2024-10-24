import { updateForms } from "./dom";

const dataBase = (function () {
  let projects = [];

  function getProjects() {
    return projects;
  }

  const getProject = (index) => {
    return projects[index];
  };

  function setProjects(array) {
    projects = [...array];
  }

  function addProject(name, description, tasks) {
    projects.push(createNewProject(name, description, tasks));
    saveData();
    updateForms();
  }

  function addCategory(name, description, tasks = [], isCategory = 1) {
    projects.push(createNewProject(name, description, tasks, isCategory));
    saveData();
  }

  function deleteProject(projectIndex) {
    projects.splice(projectIndex, 1);
    saveData();
    updateForms();
  }

  function deleteAllProjects() {
    for (let i = 0; i < projects.length; i++) {
      projects.splice(i, 1);
      i--;
    }
    saveData();
    updateForms();
  }

  return {
    addProject,
    addCategory,
    deleteProject,
    deleteAllProjects,
    getProject,
    getProjects,
    setProjects,
  };
})();

class project {
  constructor(name, description, tasks = [], isCategory = 0, complete = 0) {
    this.name = name;
    this.description = description;
    this.tasks = tasks;
    this.isCategory = isCategory;
    this.complete = complete;
  }

  addTask(name, duedate, priority, description, project) {
    this.tasks.push(
      createNewTask(name, duedate, priority, description, project)
    );
    saveData();
  }

  deleteTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
    saveData();
  }
}

class task {
  constructor(name, duedate, priority, description, project, complete = 0) {
    this.name = name;
    this.duedate = duedate;
    this.priority = priority;
    this.description = description;
    this.project = project;
    this.complete = complete;
  }
}

function createNewTask(name, duedate, priority, description, project) {
  const newTask = new task(name, duedate, priority, description, project);
  return newTask;
}

function createNewProject(name, description, tasks, isCategory) {
  const newProject = new project(name, description, tasks, isCategory);
  return newProject;
}

function saveData() {
  const myProjects = JSON.stringify(dataBase.getProjects());
  localStorage.setItem("projects", myProjects);
}

function loadData() {
  const myProjects = JSON.parse(localStorage.getItem("projects"));
  const recreatedProjects = [];
  if (myProjects != null) {
    for (let i = 0; i < myProjects.length; i++) {
      recreatedProjects[i] = createNewProject(
        myProjects[i].name,
        myProjects[i].description,
        myProjects[i].tasks,
        myProjects[i].isCategory,
        myProjects[i].complete
      );
    }
    dataBase.setProjects(recreatedProjects);
  }
}

export {
  dataBase,
  createNewProject,
  createNewTask,
  project,
  task,
  saveData,
  loadData,
};
