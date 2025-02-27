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

function editNotes(element){
    var noteElement = element.parentElement.parentElement.querySelector('div[name="text"]').firstElementChild
    noteElement.innerHTML = `<textarea name="note" >` + noteElement.innerHTML + `</textarea>`
    + `<button onclick="saveNotes(this)">Save</button>`;
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