jQuery(document).ready(function () {
    jQuery.ajax({
        url:'http://localhost:8000/task/api/getall',
        method: 'GET'
    })
    .done(function(response){
        var tasks = JSON.parse(response);
        writeTasks(tasks);
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
            var tasks = JSON.parse(response);
            writeTasks(tasks);
        });
       
    });
    function writeTasks(tasks) {
        var tbody = jQuery('tbody');
        tbody.children().remove();
        if (tasks !== null) {
            tasks.forEach(function(task){
                var creationDate = new Date(task.creationDate * 1000);
                var completionDate = new Date(task.completionDate * 1000);
                var taskRow = jQuery('<tr id='+task.id+'><td>'+task.description+'</td><td>'+ creationDate.toLocaleDateString('pl-PL')+'</td><td>'+ completionDate.toLocaleDateString('pl-PL')+'</td>'+writeActionButtons()+'');
                taskRow.appendTo(tbody);
            });
        }
    }
    function writeActionButtons(){
        return '<td><button class="btn btn-primary "  name="delete" type="submit">Done</button></td><td><button class="btn btn-primary "  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
});