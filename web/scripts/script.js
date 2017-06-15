jQuery(document).ready(function () {
    var calendar = $('#datepicker').datepicker({
        todayHighlight: true
    });
    var today = new Date();
    var todayMidnight = today.setHours(0,0,0,0)/1000;
    $('#date_hidden_input').val(todayMidnight);
    calendar.on('changeDate', function() {
        var date = $('#date_hidden_input').val(
            calendar.datepicker('getDate')
        );
        jQuery.ajax({
                url:'http://localhost:8000/task/api/get',
                method: 'GET',
                data: {'date': Date.parse(date.val())/1000}
            })
            .done(function(response){
                writeTasks(JSON.parse(response));
            });
    });
    jQuery.ajax({
        url:'http://localhost:8000/task/api/get',
        method: 'GET',
        data: {'date':  $('#date_hidden_input').val()}
    })
    .done(function(response){
        writeTasks(JSON.parse(response));
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
                });
            }
        });
        
    });
    jQuery('#newBook').on('submit', function (event){
        event.preventDefault();
        var newDateForm = jQuery(this).serialize();
        jQuery('input').val('');
        jQuery.ajax({
            url: 'http://localhost:8000/task/api/new',
            method: 'POST',
            data: newDateForm
        })
        .done(function (response){
            writeTasks(JSON.parse(response));
        });       
    });
    function writeTasks(tasks) {
        var tbody = jQuery('#tasklist tbody');
        tbody.children().remove();
        if (tasks !== null) {
            tasks.forEach(function(task){
                var creationDate = new Date(task.creationDate * 1000);
                var completionDate = new Date(task.completionDate * 1000);
                var taskRow = jQuery('<tr id='+task.id+'><td>'+task.description+'</td><td>'+ creationDate.toLocaleDateString('pl-PL')+'</td><td>'+ completionDate.toLocaleDateString('pl-PL')+'</td>'+writeActionButtons(task.id)+'');
                taskRow.appendTo(tbody);
            });
        }
        listenDatapicker();
    }
    function writeActionButtons(id){
        return '<td><button class="btn btn-primary taskdone" type="submit">Done</button></td><td><button class="btn btn-primary changeDate"  name="changeDate" type="submit">Change Completion Date</button></td>';
    }
    function writeChangeDateInput(){
        return '<div class="form-group "><label class="control-label requiredField" for="newDate">Completion Date<span class="asteriskField">*</span><input class="form-control js-datepicker" id="newDate" name="newDate" placeholder="DD/MM/YYYY" type="text" required/></label><button class="btn btn-primary change"  name="change" type="submit">Change</button></div>';
    }
    function listenDatapicker(){
        jQuery('.js-datepicker').datepicker({
                    todayHighlight: true,
                    autoclose: true
        });
    }
});