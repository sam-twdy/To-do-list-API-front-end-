let activeType = 'all';
let taskCount = 0;

$(".demo.index").ready(function(){
    var getAndDisplayAllTasks = function (type) {
      $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=391',
        dataType: 'json',
        success: function (response, textStatus) {
          $('#todo-list').empty();
          taskCount = 0;
          response.tasks.filter(function(task) {
              if (type === 'active') {
              return task.completed === false;
            } else if (type === 'completed') {
              return task.completed === true;
            } else if (type === 'all') {
              return true;
            }
          }).forEach(function (task) {
            $('#todo-list').append('<div class="row">'+
            '<input type="checkbox" class="mark-complete col-xs-1" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '>' +
            (task.completed ? '<p class="col-xs-8 task-content-completed">' : '<p class="col-xs-8">') + task.content + '</p>'+
            '<button class="delete" data-id="' + task.id + '">Delete</button>');
            if (task.completed === false) {
                taskCount++
            }
          });
          updateListItemCount();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
    }
    
    var createTask = function () {
      $.ajax({
        type: 'POST',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=391',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          task: {
            content: $('#new-task-content').val()
          }
        }),
        success: function (response, textStatus) {
          $('#new-task-content').val('');
          getAndDisplayAllTasks(activeType);
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });  
    }
    
    $('#task-input').on('submit', function (e) {
      e.preventDefault();
      createTask();
    });

    var deleteTask = function (id) {
        $.ajax({
    type: 'DELETE',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=391',
        success: function (response, textStatus) {
            getAndDisplayAllTasks(activeType);
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
        });
    }

    $(document).on('click', '.delete', function () {
        deleteTask($(this).data('id'));
    });

    var markTaskComplete = function (id) {
        $.ajax({
          type: 'PUT',
          url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=391',
          dataType: 'json',
          success: function (response, textStatus) {
            //let activeType = $('.filter-btn').attr('id');
            getAndDisplayAllTasks(activeType);
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });
      }
    
      var markTaskActive = function (id) {
        $.ajax({
          type: 'PUT',
          url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=391',
          dataType: 'json',
          success: function (response, textStatus) {
            //let activeType = $('.filter-btn').attr('id');
            getAndDisplayAllTasks(activeType);
          },
          error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
          }
        });
      }
    
      $(document).on('change', '.mark-complete', function () {
        if (this.checked) {
          markTaskComplete($(this).data('id'));
        } else {
          markTaskActive($(this).data('id'));
        }
      });

      $(document).on('click', '.filter-btn', function () {
        getAndDisplayAllTasks(this.id);
        activeType = this.id
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
      })

      var updateListItemCount = function () {
        document.getElementById("todo-amount").textContent=taskCount;
      };

    getAndDisplayAllTasks(activeType);
    
});
