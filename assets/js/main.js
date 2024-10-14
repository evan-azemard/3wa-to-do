const allDeleteBTN = document.querySelector('input[name="all-delete"]');
const addTaskForm = document.querySelector('form[name="add-task"]');
const taskListHTML = document.querySelector('#task-list');
const inputDescription = document.querySelector('#description');
const orderSelect = document.querySelector('select[name="order"]');
const prioritySelect = document.querySelector('select[name="priority"]');
const taskStatusSelect = document.querySelector('select[name="task"]');

/*
 console.log(addTaskBTN,allDeleteBTN,taskForm,addTaskForm,taskListHTML);
 */

const sortTasks = () => {
	let sortedTasks = [...tasks];

	switch(prioritySelect.value) {
	case "heightPriority":
		sortedTasks = sortedTasks.filter(task => task.priority === 1);
		break;
	case "normalPriority":
		sortedTasks = sortedTasks.filter(task => task.priority === 2);
		break;
	case "lowPriority":
		sortedTasks = sortedTasks.filter(task => task.priority === 3);
		break;
	case "allPriority":
	default:
		break;
	}
	
	switch(taskStatusSelect.value) {
	case "inProgress":
		sortedTasks = sortedTasks.filter(task => task.inProgress);
		break;
	case "finished":
		sortedTasks = sortedTasks.filter(task => !task.inProgress);
		break;
	case "all":
	default:
		break;
	}

	switch(orderSelect.value) {
	case "hightOrder":
		sortedTasks.sort((a, b) => a.priority - b.priority);
		break;
	case "lowOrder":
		sortedTasks.sort((a, b) => b.priority - a.priority);
		break;
	default:
		break;
	}

	renderSortedHTML(sortedTasks);
}

const saveTasksToLocalStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasksFromLocalStorage = () => {
	const storageTasks = localStorage.getItem('tasks');
	if (storageTasks) {
		tasks = JSON.parse(storageTasks);
	}
}

// HTML template
const HTMLTemplate = (index, title, priority, inProgress, color) => {
	return `
    <div class="row mt-1 ${color} text-light" data-id="${index}" id="task-${index}">
        <div class="col-6">
            <div class="row">
            <div class="form-group d-flex">
	            <input id="check-input-${index}" class="form-check-input validate-checkbox" type="checkbox" name="state" value="validate" data-id="${index}" ${!inProgress ? 'checked' : ''}>
                 <label class="form-check" for="check-input-${index}" id="check-label-${index}">
                ${!inProgress ? "Terminé" : "En cours"}
                </label>
			</div>
            </div>
            <div class="row">
                <button class="m-2 btn btn-light delete" data-id="${index}">
                    Supprimer
                </button>
            </div>
        </div>
        <div class="col-6">
      		<p class="task-text ${!inProgress ? 'text-decoration-line-through' : ''}" id="task-text-${index}">${title}</p>
        </div>
        <input type="hidden" name="inProgress" value="${inProgress}">
        <input type="hidden" name="priority" value="${priority}">
    </div>
    `;
}

let tasks = [
	{
		title: "Apprendre mon cours de JavaScript",
		priority: 1,
		inProgress: true,
	},
	{
		title: "Créer mon compte Github",
		priority: 2,
		inProgress: true,
	},
	{
		title: "Répondre à mes emails",
		priority: 3,
		inProgress: true,
	}
];


const renderSortedHTML = (sortedTasks) => {
	taskListHTML.innerHTML = "";

	tasks.sort((a, b) => a.priority - b.priority);


	sortedTasks.forEach((task, index) => {
		let color =   task.priority === 1 ? "bg-danger" : (task.priority === 2 ? "bg-success"   : "bg-primary")

		taskListHTML.innerHTML += HTMLTemplate(index,task.title,task.priority,task.inProgress,color);

		//Checked
		document.querySelectorAll('.validate-checkbox').forEach((checkbox) => {
			checkbox.addEventListener('change', (e) => {
				const taskID = e.target.getAttribute('data-id');
				const label = document.getElementById(`check-label-${taskID}`)
				const taskText = document.getElementById(`task-text-${taskID}`); // Sélection du texte à barrer

				console.log(label);
				tasks[taskID].inProgress = !e.target.checked;

				if (tasks[taskID].inProgress) {
					taskText.classList.remove('text-decoration-line-through');
					label.textContent = 'En cours';
				} else {
					taskText.classList.add('text-decoration-line-through');
					label.textContent = 'Terminé';
				}
				saveTasksToLocalStorage();
			})
		})

		//Delete
		document.querySelectorAll('.delete').forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();

				const taskID = e.target.getAttribute('data-id');

				const task = document.querySelector(`#task-${taskID}`);
				task.remove();

				tasks.splice(taskID, 1);
				saveTasksToLocalStorage();
			})
		})

	})
}
//All delete
allDeleteBTN.addEventListener("click", (e) => {
	e.preventDefault();
	let count = 0;

	tasks.forEach((task, index) => {
		const taskElement = document.getElementById(`task-${index}`);

		if(!task.inProgress){
			taskElement.remove()
			count++;
		}
	})
	tasks = tasks.filter(task => task.inProgress);
	alert(`${count} tâche(s) supprimée(s)`);
	renderSortedHTML(tasks);
});

//Add a new task in tasks
addTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();

	if(inputDescription.value.trim() !== "")
		{
			let formData = new FormData(addTaskForm);
			let toDoName = formData.get('to-do-name');
			let priority = Number(formData.get('priority'));

			let newTask = {title: toDoName,priority: priority ,inProgress: true};

			tasks.push(newTask);

			saveTasksToLocalStorage();
			renderSortedHTML(tasks);
			inputDescription.value = '';
			
		}
})

orderSelect.addEventListener('change', sortTasks);
prioritySelect.addEventListener('change', sortTasks);
taskStatusSelect.addEventListener('change', sortTasks);

loadTasksFromLocalStorage();

renderSortedHTML(tasks);
