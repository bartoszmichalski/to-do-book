jQuery(document).ready(function () {
    jQuery.ajax({
        url:'http://localhost:8000/task/api/getall',
        method: 'GET'
    })
    .done(function(response){
        writeTasks(JSON.parse(response));
    }); 
    jQuery(document).on('click', '.deltask', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        var id = $(this).parent().parent().parent().attr('id');
        console.log(id);
        jQuery.ajax({
            url:'http://localhost:8000/task/api/done',
            method: 'PUT',
            data: {'id':id}
        })
        .done(function(response){
            writeTasks(JSON.parse(response));
        });
    });
    jQuery('.js-datepicker').datepicker({
        format: "dd.mm.yyyy",
        todayHighlight: true,
        autoclose: true
    });
    jQuery('#newBook').on('submit', function (event){
        event.preventDefault();
        jQuery.ajax({
            url: 'http://localhost:8000/task/api/new',
            method: 'POST',
            data: jQuery(this).serialize()
        })
        .done(function (response){
            writeTasks(JSON.parse(response));
        });       
    });
    function writeTasks(tasks) {
        var tbody = jQuery('tbody');
        tbody.children().remove();
        if (tasks !== null) {
            tasks.forEach(function(task){
                var creationDate = new Date(task.creationDate * 1000);
                var completionDate = new Date(task.completionDate * 1000);
                var taskRow = jQuery('<tr id='+task.id+'><td>'+task.description+'</td><td>'+ creationDate.toLocaleDateString('pl-PL')+'</td><td>'+ completionDate.toLocaleDateString('pl-PL')+'</td>'+writeActionButtons(task.id)+'');
                taskRow.appendTo(tbody);
            });
        }
    }
    function writeActionButtons(id){
        return '<td><form><button class="btn btn-primary deltask" type="submit">Done</button></form></td><td><button class="btn btn-primary "  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
});