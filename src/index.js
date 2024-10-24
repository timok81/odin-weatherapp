import "./styles.css";
import { dataBase, loadData } from "./createtask";
import { setupMenu, renderMenu, renderContent } from "./dom";

//Load localStorage data
loadData();

//Generate default project
if (
  dataBase.getProjects().filter((item) => item.isCategory === 0).length === 0
) {
  dataBase.addProject(
    "Default project",
    'This is an automatically generated default project. Add new tasks by either clicking on the "+" button below, or in the menu on the left, where new projects may also be created. Tasks can be marked completed with the checkbox to their left, and expanded by clicking on their name. Toggling the project complete will move it into the "Completed projects" category.',
  );
}

//Generate categories
if (
  dataBase.getProjects().filter((item) => item.isCategory != 0).length === 0
) {
  dataBase.addCategory("Today", "These tasks are due today.", [], 1);
  dataBase.addCategory("This week", "These tasks are due this week.", [], 2);
}

//Render menu and content
renderMenu(dataBase.getProjects());
if (dataBase.getProjects().length > 0) {
  renderContent(dataBase.getProjects()[0]);
}
setupMenu();
