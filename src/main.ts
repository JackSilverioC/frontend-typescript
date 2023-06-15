import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./style.css";
import { v4 } from "uuid";

const taskForm = document.querySelector<HTMLFormElement>("#taskForm"),
  taskList = document.querySelector<HTMLDivElement>("#taskList"),
  fragment = document.createDocumentFragment();

interface Task {
  title: string;
  description: string;
  id: string;
}

let tasks: Task[] = [];

taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;

  tasks.push({
    title: title.value,
    description: description.value,
    id: v4()
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  Toastify({
    text: "Tarea agregada correctamente",
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #5C8984, #96c93d)",
      borderRadius: "10px",
      color: "#fff"
    }
  }).showToast();

  renderTasks(tasks);

  taskForm.reset();
  title.focus();
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks(tasks);
});

function renderTasks(tasks: Task[]) {
  taskList!.innerHTML = "";
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-800 p-4 rounded-md hover:bg-zinc-700 transition-colors hover:cursor-pointer";
    const header = document.createElement("header");
    header.className = "flex justify-between items-center";

    const title = document.createElement("span");
    title.className = "font-bold text-xl";
    title.innerText = task.title;

    const btnDelete = document.createElement("button");
    btnDelete.className =
      "bg-red-500 px-1  rounded-md text-white hover:bg-red-800 transition-colors";
    btnDelete.innerText = "Borrar";
    btnDelete.addEventListener("click", () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
      Toastify({
        text: "Tarea eliminada correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #DB005B, #B31312)",
          borderRadius: "10px",
          color: "#fff"
        }
      }).showToast();
    });

    const description = document.createElement("p");
    description.className = "text-sm text-gray-400 font-light";
    description.innerText = task.description;

    header.appendChild(title);
    header.appendChild(btnDelete);
    taskElement.appendChild(header);
    taskElement.appendChild(description);

    const id = document.createElement("p");
    id.innerText = task.id;
    id.className = "text-xs text-gray-400 text-right";
    taskElement.appendChild(id);
    fragment.appendChild(taskElement);
  });
  taskList?.appendChild(fragment);
}
