jQuery(document).ready(function () {
    jQuery('.js-datepicker').datepicker({
        format: "yyyy-mm-dd",
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
                var newLi = jQuery('<tr><td>'+task.description+'</td><td>'+ creationDate.toLocaleDateString('pl-PL')+'</td><td>'+ completionDate.toLocaleDateString('pl-PL')+'</td></tr>');
                newLi.appendTo(tbody);
            });
        }
    } 
});