// *********** GET MARKED TASKS ***********
function getMarkedTasks(sort) {
    $.ajax({
        url: 'get-marked-tasks/?sort=' + sort,
        type: 'GET',
        success: function(data) {
            let taskIteration = 0;
            data.marked_tasks.forEach(function (task) {
                if(taskIteration <= 1){
                    console.log(task)
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
            // $('#tasks').html('');
            let taskIteration = 0;
            data.tasks.forEach(function (task) {

                //******** START TASK DIV ********
                // $('#tasks').append(
                //     `<div id="taskID${task.id}" onchange='completeTask(${task.id}, "task")'>` +
                //         '<h2 class="title">' + task.title + '</h2>' +
                //         '<h4 class="desc">' + task.description + '</h4>' +
                //         '<h4 class="date">' + task.date + '</h4>' +
                //         '<h4 class="importance">' + task.importance + '</h4>' +
                //         '<input class="checkbox" type="checkbox" id="check' + task.id + '" ><br><br>' +
                //         '<hr>' +
                //     '</div>'
                // );

                if(taskIteration <= 1){
                    console.log(task)
                }
                taskIteration++;
            })
        }
    });
}