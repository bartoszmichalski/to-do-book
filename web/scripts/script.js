jQuery(document).ready(function () {
    jQuery.ajax({
        url:'http://localhost:8000/task/api/getall',
        method: 'GET'
    })
    .done(function(response){
        writeTasks(JSON.parse(response));
    }); 
    jQuery(document).on('click', '.taskdone', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        jQuery.ajax({
            url:'http://localhost:8000/task/api/done',
            method: 'PUT',
            data: {'id':$(this).parent().parent().attr('id')}
        })
        .done(function(response){
            writeTasks(JSON.parse(response));
        });
    });
    jQuery(document).on('click', '.changeDate', function(event){
        $('.changeDate').show();
        $(this).hide();
        $('td div').remove();
        $(this).parent().append(writeChangeDateInput());
        event.preventDefault();
        event.stopImmediatePropagation();
        jQuery(document).on('click', '.change', function(event){
            var newDate = $('#newDate').val();
            jQuery.ajax({
                url:'http://localhost:8000/task/api/changedate',
                method: 'PUT',
                data: {'id':$(this).parent().parent().parent().attr('id'), 'date': newDate}
            })
            .done(function(response){
                writeTasks(JSON.parse(response));
            });
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
        return '<td><button class="btn btn-primary taskdone" type="submit">Done</button></td><td><button class="btn btn-primary changeDate"  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
    function writeChangeDateInput(){
        return '<div class="form-group "><label class="control-label requiredField" for="newDate">Completion Date<span class="asteriskField">*</span><input class="form-control js-datepicker" id="newDate" name="newDate" placeholder="DD/MM/YYYY" type="text"/></label><button class="btn btn-primary change"  name="change" type="submit">Change</button></div>';
    }
});