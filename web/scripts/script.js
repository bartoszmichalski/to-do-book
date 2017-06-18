jQuery(document).ready(function () {
    var calendar = $('#datepicker').datepicker({
        weekStart: 1,
        format: 'dd.mm.yyyy',
        todayHighlight: true
    });
    $('#date_hidden_input').val(
            Date.parse(new Date(new Date().setHours(0,0,0,0)))/1000
    );  
    jQuery.ajax({
        url:'http://localhost:8000/task/api/getall',
        method: 'GET'
    })
    .done(function(response){
        writeTasks(JSON.parse(response));
        hideTasksForOtherDays($('#date_hidden_input').val());
    });
    
    jQuery('#alltasks').on('click', function (event){
        $('#date_hidden_input').val(0); 
        jQuery.ajax({
            url:'http://localhost:8000/task/api/getall',
            method: 'GET'
        })
        .done(function (response){
            writeTasks(JSON.parse(response));
        });       
    });
    
    calendar.on('changeDate', function() {
        $('#date_hidden_input').val(
            Date.parse(calendar.datepicker('getDate'))/1000
        );
        jQuery.ajax({
                url:'http://localhost:8000/task/api/getall',
                method: 'GET'
            })
            .done(function(response){
                writeTasks(JSON.parse(response));
                hideTasksForOtherDays($('#date_hidden_input').val());            
            });
    }); 
    jQuery(document).on('click', '.taskdone', function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        var taskId = $(this).parent().parent().attr('id');
        $(this).closest('tr')
            .children('td')
            .animate({ paddingBottom: 0, paddingTop: 0 })
            .wrapInner('<div />')
            .children()
            .slideUp( function() { $(this).closest('tr').remove(); });
        jQuery.ajax({
            url:'http://localhost:8000/task/api/done',
            method: 'PUT',
            data: {'id':taskId}
        })
        .done(function(response){
            writeTasks(JSON.parse(response));
            hideTasksForOtherDays($('#date_hidden_input').val());
        });
    });
    
    jQuery(document).on('click', '.changeDate', function(event){
        $('.changeDate').show();
        $(this).hide();
        $('td div').remove();
        $(this).parent().append(writeChangeDateInput());
        event.preventDefault();
        event.stopImmediatePropagation();
        listenDatapicker();
        jQuery(document).on('click', '.change', function(event){
            var newDate = Date.parse($('#newDate').val())/1000;
            if (typeof newDate === 'number' && newDate > 1 ) {
                jQuery.ajax({
                    url:'http://localhost:8000/task/api/changedate',
                    method: 'PUT',
                    data: {'id':$(this).parent().parent().parent().attr('id'), 'date': newDate}
                })
                .done(function(response){
                    writeTasks(JSON.parse(response));
                    hideTasksForOtherDays($('#date_hidden_input').val());
                });
            }
        });        
    });
    jQuery('#newBook').on('submit', function (event){
        event.preventDefault();
        event.stopImmediatePropagation();
        var newDateForm = jQuery(this).serialize();
        jQuery('#newBook input').val('');
        jQuery.ajax({
            url: 'http://localhost:8000/task/api/new',
            method: 'POST',
            data: newDateForm
        })
        .done(function (response){
            writeTasks(JSON.parse(response));
            hideTasksForOtherDays($('#date_hidden_input').val());
        });       
    });
    function writeTasks(tasks) {
        var tbody = jQuery('#tasklist tbody');
        tbody.children().remove();
        if (tasks !== null) {
            tasks.forEach(function(task){
                var creationDate = new Date(task.creationDate * 1000);
                var completionDate = new Date(task.completionDate * 1000);
                var taskRow = jQuery('<tr id='+task.id+' data-task-date='+task.completionDate+'><td>'+task.description+'</td><td>'+ creationDate.toLocaleDateString('pl-PL')+'</td><td>'+ completionDate.toLocaleDateString('pl-PL')+'</td>'+writeActionButtons());
                taskRow.appendTo(tbody);
            });
        }
        listenDatapicker();
    }
    function writeActionButtons(){
        return '<td><button class="btn btn-primary taskdone" type="submit">Done</button></td><td><button class="btn btn-primary changeDate"  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
    function writeChangeDateInput(){
        return '<div class="form-group "><label class="control-label requiredField" for="newDate">Completion Date<span class="asteriskField">*</span><input class="form-control js-datepicker" id="newDate" name="newDate" placeholder="DD/MM/YYYY" type="text" required/></label><button class="btn btn-primary change"  name="change" type="submit">Change</button></div>';
    }
    function listenDatapicker(){
        jQuery('.js-datepicker').datepicker({
                    weekStart: 1,
                    format: 'dd.mm.yyyy',
                    todayHighlight: true,
                    autoclose: true
        });
    }
    function hideTasksForOtherDays(tasksForDate) {
        if (tasksForDate != 0) {
            jQuery('#tasklist tr:not([data-task-date='+tasksForDate+'])').hide();
        }
    }
});