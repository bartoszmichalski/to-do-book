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
            console.log(tasks);
        } );
       
    });
            
});