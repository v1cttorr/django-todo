// *********** GET MARKED TASKS ***********
function getMarkedTasks(sort) {
    $.ajax({
        url: 'get-marked-tasks/?sort=' + sort,
        type: 'GET',
        success: function(data) {
            let taskIteration = 0;
            $('#markedlist').html('');

            data.marked_tasks.forEach(function (task) {
                if(taskIteration <= 1){
                    var dateObj = new Date(task.date);
                    var hours = dateObj.getHours();
                    var minutes = dateObj.getMinutes();
                    var formattedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');

                    $('#markedlist').append(`
                    <div name="task" class="border-2 rounded-[12px] text-white flex flex-row justify-between gap-2 bg-[#09151B]" style="filter: drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.2));">
                        <div name="time" class="flex justify-center items-center">
                            <p class="p-2 ml-4">${formattedTime}</p>
                        </div>
                        <div name="titleAndDescription" class="flex flex-col p-2">
                            <p name="title">${task.title}</p>
                            <p name="description" class="text-[10px] max-w-[150px]">${task.description}</p>
                        </div>
                        <div name="edit" class="m-3">
                            <a href="#"><img src="${editImage}"></a>
                        </div>
                    </div>
                    `)
                }

                taskIteration++;
            })
        }
    })
}

//*************** GET TASKS FOR SCHEDULE ***************
function getTasksForSchedule(sort){
    $.ajax({
        url: 'get-tasks/?sort=' + sort,
        type: 'GET',
        success: function(data) {
            $('#tasklist').html('');
            let taskIteration = 0;
            data.tasks.forEach(function (task) {

                if(taskIteration <= 1){
                    var dateObj = new Date(task.date);
                    var hours = dateObj.getHours();
                    var minutes = dateObj.getMinutes();
                    var formattedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');

                    $('#tasklist').append(`
                        <div name="task" class="border-2 rounded-[12px] text-white flex flex-row justify-between gap-2 bg-[#09151B]" style="filter: drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.2));">
                            <div name="time" class="flex justify-center items-center">
                                <p class="p-2 ml-4">${formattedTime}</p>
                            </div>
                            <div name="titleAndDescription" class="flex flex-col p-2">
                                <p name="title">${task.title}</p>
                                <p name="description" class="text-[10px] max-w-[150px]">${task.description}</p>
                            </div>
                            <div name="edit" class="m-3">
                                <a href="#"><img src="${editImage}"></a>
                            </div>
                        </div>
                    `)
                }
                taskIteration++;
            })
        }
    });
}

var isEditingNote = false

function editNotes(element){
    if(!isEditingNote){
        var noteElement = element.parentElement.parentElement.querySelector('div[name="text"]').firstElementChild
        noteElement.innerHTML = `<textarea name="note" >` + noteElement.innerHTML + `</textarea>`
        + `<button onclick="saveNotes(this)">Save</button>`;
        isEditingNote = true
    }   
}

function saveNotes(element){
    var noteElement = element.parentElement.parentElement.firstElementChild
    notes = noteElement.querySelector('textarea').value
    noteElement.innerHTML = notes;

    $.ajax({
        url: 'edit-notes/',
        type: 'POST',
        data: {
            notes: notes,
        },
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(data) {
            getNotes()
        }
    })
    isEditingNote = false
}

function getNotes(){
    $.ajax({
        url: 'get-notes/',
        type: 'GET',
        success: function(data) {
            $('#notesID').html(data.notes)
        }
    })
}

getNotes()

// ***************** GET TASKS *****************
function getTasks(sort){
    sort_by = sort
    $.ajax({
        url: 'get-tasks/?sort=' + sort,
        type: 'GET',
        success: function(data) {
            var leftCol =  $('#leftColumnTasks')
            // var leftCol =  $('#leftColumn')
            var rightCol =  $('#rightColumn')
            leftCol.html('');
            rightCol.html('');

            var taskIteration = 0;


            //LOOP FOR EACH TASK
            data.tasks.forEach(function (task) {
                taskIteration++


                // TODO
                // poprawic progress bar do kazdego diva

                let firstLine = `<div name="ExampleTask" onclick="showHideSubtasks('subtasks${task.id}')" class="flex flex-col gap-4 bg-[${task.background_color}] rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] cursor-pointer select-none">`

                if(taskIteration%2){
                    var currentCol = leftCol
                }
                else{
                    var currentCol = rightCol
                }

                //ADD TASK TO COLUMN
                currentCol.append(firstLine
                    +`
                    <div name="Task-content" class="flex flex-col m-7 ml-12">
                        <div name="tags" class="flex flex-row gap-8 text-sm">
                            <p name="time" class="flex flex-row items-center gap-1 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                <img src="${timeImg}" class="h-[20px]"> ${task.date}
                            </p>
                            <p name="importance" class="flex flex-row items-center gap-1 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                <img src="${importanceImg}" class="h-[20px]"> ${task.importance_label}
                            </p>
                            <p name="notification" class="flex flex-row items-center gap-1 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                <img src="${bellImg}" class="h-[20px]"> Notification - Yes
                            </p>
                            <p name="delete" class="flex flex-row items-center gap-1 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                <a href="/room/delete/${task.id}" onclick="return"><img src="${deleteImg}" class="h-[20px]"></a>
                            </p>
                        </div>
                        <div name="title" class="mt-4 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                            <p class="font-semibold text-[20px]">${task.title}</p>
                        </div>
                        <div name="desciption" class="mt-2">
                            <p name="description-text" class="text-[12px] max-w-[70%] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                ${task.description}
                            </p>
                        </div>
                        <div name="task-progress">
                            <div name="currentProgress">
                                <p class="font-normal text-sm mt-2 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                    Current Progress - <span id="percentOfCompletedTasks${task.id}">25%</span>
                                </p>
                            </div>
                            <div name="progressBar" class="relative w-[300px] h-[15px] rounded-[5px] bg-[#CACACA] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                <div id="progress${task.id}" class="bg-black w-[50px] h-[15px] rounded-[5px]"></div>
                            </div>

                            <input type="checkbox" class="hidden peer checkBoxState" id="taskID${task.id}" onchange='completeTask(${task.id}, "task", "${sort}")' />
                            
                            <div name="completedTasks" class="mt-1.5" id="completedTasks${task.id}">
                                <p class="font-normal text-sm text-[#09151B] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                                    <span id="tasksDone${task.id}">5</span>/<span id="allTasks${task.id}">20</span> tasks are done!
                                </p>
                            </div>
                        </div>
                        <div id="subtasks${task.id}">
                            <script>
                                var subtask = document.getElementById("subtasks${task.id}");
                                subtask.addEventListener("click", (event) => {
                                    event.stopPropagation();
                                });
                            </script>
                            <div id="subtasksForm${task.id}" class="flex flex-col gap-2 p-4 rounded-lg w-fit">
                                <label class="flex items-center gap-2 text-black text-base">
                                    <input type="checkbox" class="hidden peer" />
                                    <span class="w-4 h-4 border-2 border-black flex items-center justify-center peer-checked:bg-black">
                                    </span>
                                    Call client
                                </label>
                        
                                <label class="flex items-center gap-2 text-black text-base">
                                    <input type="checkbox" class="hidden peer" />
                                    <span class="w-4 h-4 border-2 border-black flex items-center justify-center peer-checked:bg-black">
                                    </span>
                                    Talk about preferences
                                </label>
                        
                                <label class="flex items-center gap-2 text-black text-base">
                                    <input type="checkbox" class="hidden peer" />
                                    <span class="w-4 h-4 border-2 border-black flex items-center justify-center peer-checked:bg-black">
                                        <svg class="w-3 h-3 text-white hidden peer-checked:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </span>
                                    Visualize his idea
                                </label>
                                <form method="POST" name="addSubtask" class="w-fit mt-1">
                                    <input type="text" name="title" placeholder="Add subtask..." class="outline-none bg-transparent text-black text-base" style="all:unset">
                                </form>
                            </div>                        
                        </div>
                    </div>
                </div>
                `)


                //******************** START SUBTASKS DIV *********************
                var subtaskForm = document.getElementById(`subtasksForm${task.id}`);
                var subtask_complete = 0
                var subtask_all = 0
                
                subtaskForm.innerHTML = ''

                //LOOP FOR EACH SUBTASK
                data.subtasks.forEach(function(subtask){
                    if(subtask.task_id == task.id){
                        subtaskForm.innerHTML += 
                            `
                            <label class="flex items-center gap-2 text-black text-base" id="subtaskID${subtask.id}" onchange='completeTask(${subtask.id}, "subtask", "${sort}")'>
                                <input type="checkbox" class="hidden peer checkboxState" id="subcheck` + subtask.id + `"  />
                                <span class="w-4 h-4 border-2 border-black flex items-center justify-center peer-checked:bg-black">
                                </span>
                                ${subtask.title}
                            </label>
                            `
                            
                            setTimeout(() => {
                                document.getElementById('subcheck' + subtask.id).checked = subtask.completed; //SET CHECKBOX STATE FROM DATABASE
                            }, 0);
                            
                            if(subtask.completed){
                                subtask_complete++
                            }
                            subtask_all++
                    }
                })

                if(subtask_all != 0){
                    $('#completedTasks'+task.id).show()
                    $('#tasksDone'+task.id).html(subtask_complete)
                    $('#allTasks'+task.id).html(subtask_all)
                }
                else{
                    $('#completedTasks'+task.id).hide()
                }

                

                //nie zmieniac div na form bo bedzie dzialac gorzej
                //ADD SUBTASK FORM TO TASK
                subtaskForm.innerHTML += `
                    <div name="addSubtask" class="w-fit mt-1" id="addSubtask` + task.id + `">
                        <input type="text" name="title" placeholder="Add subtask..." class="outline-none bg-transparent text-black text-base" style="all:unset">
                        
                        <button onclick="addSubtask(${task.id}, '${sort.toString()}')">Add Subtask</button>
                    </div>
                `
                
                let progressBar = document.getElementById("progress" + task.id)
                let progressWidth = (300 * subtask_complete / subtask_all) + "px";
                progressBar.style.width = progressWidth;
                let percentOfCompletedTasks = document.getElementById("percentOfCompletedTasks"+task.id);
                
                if(subtask_all == 0){
                    progressBar.style.width = "0px";
                    //CHECKBOX FOR TASKS WITHOUT SUBTASKS
                    var taskCheckbox = document.getElementById('taskID' + task.id)
                    taskCheckbox.classList.remove('hidden')
                    taskCheckbox.classList.add('onlyTask') //task without subtasks
                    if(task.completed){
                        taskCheckbox.checked = true
                    }
                }
                if(percentOfCompletedTasks){
                    if(!isNaN(subtask_complete / subtask_all))
                        percentOfCompletedTasks.innerHTML = Math.round((subtask_complete / subtask_all) * 100) + "%";
                    else
                        percentOfCompletedTasks.innerHTML = "0%";
                }

                //done task
                if(subtask_complete === subtask_all && subtask_all !== 0){
                    completeTask(task.id, 'task', sort, true)
                }
                else{
                    completeTask(task.id, 'task', sort, false)
                }
            })
        }
    });
}



getTasks('date')
increaseMainProgress()




//*************** SAVE COMPLETE TASK ***************
//********* task_type: task or subtask *************
function completeTask(id, task_type, sort, task_complete=false){
    task = task_type == 'task' ? $('#taskID' + id) : $('#subtaskID' + id)

    if(task_type == 'task'){
        var completed = task_complete
        var completedElement = document.getElementById('taskID' + id)
        
        if (completedElement.classList.contains('onlyTask')){    
            var completed = completedElement.checked
            let progressBar = document.getElementById("progress" + id)
            let percentOfCompletedTasks = document.getElementById("percentOfCompletedTasks"+id);
            
            if(completed){
                progressBar.style.width = "300px";
                percentOfCompletedTasks.innerHTML = "100%";
            }
            else{
                progressBar.style.width = "0px";
                percentOfCompletedTasks.innerHTML = "0%";
            }
        }
    }
    else
        var completed = task.find('.checkboxState').prop('checked')

    $.ajax({
        url: 'complete-task/' + id + '/' + task_type + '/',
        type: 'POST',
        data: {
            completed: completed
        },
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(response) {
            if(task_type != 'task'){
                getTasks(sort)
            }
            setTimeout(increaseMainProgress, 250)
        },
        error: function(xhr, status, error) {
            console.error('Blad AJAX:', status, error);
        }
    });
}


//*************** ADD SUBTASK ***************
function addSubtask(task_id, sort){
    var title = document.getElementById('addSubtask' + task_id).querySelector('input[name="title"]').value
    $.ajax({
        url: 'add-subtask/',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        headers: {
            'X-CSRFToken': csrf_token,
        },
        contentType: 'application/x-www-form-urlencoded',
        data: {
            title: title,
            task_id: task_id,
        },
        headers: {
            'X-CSRFToken': csrf_token,
        },
        success: function(response) {
            getTasks(sort)
        }
    });
}

//Edycja tasków
function editText(element) {
    const textElement = element.querySelector('p');
    const currentText = textElement.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = textElement.className;
    
    input.addEventListener('blur', function () {
        textElement.innerText = input.value;
        element.replaceChild(textElement, input);
    });

    element.replaceChild(input, textElement);
    input.focus();
}

function editTime(element) {
    const span = element.querySelector('span');
    const input = document.createElement('input');
    input.type = 'time';
    input.value = '12:00';
    
    input.addEventListener('blur', function () {
        span.innerText = input.value;
        element.replaceChild(span, input);
    });

    element.replaceChild(input, span);
    input.focus();
}

function editImportance(element) {
    const span = element.querySelector('span');
    const select = document.createElement('select');
    const options = ['Trivial', 'Important', 'High Priority', 'Very Important'];
    
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        if (span.innerText === option) opt.selected = true;
        select.appendChild(opt);
    });
    
    select.addEventListener('blur', function () {
        span.innerText = select.value;
        element.replaceChild(span, select);
    });

    element.replaceChild(select, span);
    select.focus();
}

function editNotification(element) {
    const span = element.querySelector('span');
    const select = document.createElement('select');
    const options = ['Yes', 'No'];
    
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        if (span.innerText.includes(option)) opt.selected = true;
        select.appendChild(opt);
    });
    
    select.addEventListener('blur', function () {
        span.innerText = 'Notification - ' + select.value;
        element.replaceChild(span, select);
    });

    element.replaceChild(select, span);
    select.focus();
}

function addTask() {
    var taskElement = document.getElementById('addTask');
    taskElement.style.display = 'block';
}



 //PROGRESS BAR OF ALL TASKS
function increaseMainProgress() {
    $.ajax({
        url: 'get-completed-tasks/',
        type: 'GET',
        success: function(data) {
            increaseProgress(data.completed_tasks, data.all_tasks);
        }
    });
}

function increaseProgress(completedTasks, numberOfAllTasks) { // later add id parameters for progress div etc
    // let completedTasks = data.completed_tasks; // Pobierz z bazy ilość ukończonych tasków
    // let numberOfAllTasks = data.all_tasks; // Pobierz z bazy ilość wszystkich tasków

    let progressBar = document.getElementById("progress");
    let percentOfCompletedTasks = document.getElementById("percentOfCompletedTasks");
    let tasksDone = document.getElementById("tasksDone");
    let allTasks = document.getElementById("allTasks");
    if (tasksDone) {
        tasksDone.innerHTML = completedTasks;
    }
    if(allTasks){
        allTasks.innerHTML = numberOfAllTasks;
    }
    if (progressBar) {
        let progressWidth = (200 * completedTasks / numberOfAllTasks) + "px";
        progressBar.style.width = progressWidth;
    }
    if(percentOfCompletedTasks){
        if(!isNaN(completedTasks / numberOfAllTasks))
            percentOfCompletedTasks.innerHTML = Math.round((completedTasks / numberOfAllTasks) * 100) + "%";
        else
            percentOfCompletedTasks.innerHTML = "0%";
    }
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}