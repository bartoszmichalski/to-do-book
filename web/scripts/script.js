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
        var UL = jQuery('ul');
        UL.children().remove();
        var tasksArray = Array.from(tasks);
        console.log(tasksArray);
        tasksArray.forEach(function(task){     
            console.log(task);
            var newLi = jQuery('<li>'+task.description+'</li>');
            newLi.appendTo(UL);            
        });
    } 
});