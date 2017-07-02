jQuery(document).ready(function () {
    var calendar = $('#datepicker').datepicker({
        weekStart: 1,
        format: 'yyyy-mm-dd',
        todayHighlight: true
    });
    $('#date_hidden_input').val(
            Date.parse(new Date(new Date().setHours(0,0,0,0)))/1000
    );  
    jQuery.ajax({
        url:'/task/api/getall',
        method: 'GET'
    })
    .done(function(response){
        writeTasks(JSON.parse(response));
        hideTasksForOtherDays($('#date_hidden_input').val());
    });
    
    jQuery('#alltasks').on('click', function (event){
        $('#date_hidden_input').val(0); 
        jQuery.ajax({
            url: '/task/api/getall',
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
                url: '/task/api/getall',
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
            url: '/task/api/done',
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
            var newDateMidnight = Date.parse(new Date(new Date($('#newDate').val()).setHours(0,0,0,0)))/1000;
            if (typeof newDateMidnight === 'number' && newDateMidnight > 1 ) {
                jQuery.ajax({
                    url: '/task/api/changedate',
                    method: 'PUT',
                    data: {'id':$(this).parent().parent().parent().attr('id'), 'date': newDateMidnight}
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
            url: '/task/api/new',
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
                var taskRow = jQuery('<tr id='+task.id+' data-task-date='+task.completionDate+'><td>'+task.description+'</td><td>'+ formatDateFromTimestamp(task.creationDate * 1000)+'</td><td>'+formatDateFromTimestamp(task.completionDate * 1000)+'</td>'+writeActionButtons());
                taskRow.appendTo(tbody);
            });
        }
        listenDatapicker();
    }
    function writeActionButtons(){
        return '<td><button class="btn btn-primary taskdone" type="submit">Done</button></td><td><button class="btn btn-primary changeDate"  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
    function writeChangeDateInput(){
        return '<div class="form-group "><label class="control-label requiredField" for="newDate">Completion Date<span class="asteriskField">*</span><input class="form-control js-datepicker" id="newDate" name="newDate" placeholder="YYYY-MM-DD" type="text" required/></label><button class="btn btn-primary change"  name="change" type="submit">Change</button></div>';
    }
    function listenDatapicker(){
        jQuery('.js-datepicker').datepicker({
                    weekStart: 1,
                    format: 'yyyy-mm-dd',
                    todayHighlight: true,
                    autoclose: true
        });
    }
    function hideTasksForOtherDays(tasksForDate) {
        if (tasksForDate != 0) {
            jQuery('#tasklist tbody tr:not([data-task-date='+tasksForDate+'])').hide();
        }
    }
    function formatDateFromTimestamp(timestamp) {
        var date = new Date (timestamp);
        var day = date.getDate();
        var month = date.getMonth();
        month++;
        var year = date.getFullYear();
        return year+'-'+addZeroPrefix(month)+'-'+addZeroPrefix(day);
    }
    function addZeroPrefix(parameter){
        if (parameter < 10) {
            return '0'+parameter;
        } else {
            return parameter;
        }
    }
});