(function ($) {
  Drupal.behaviors.cmShowRequest = {
    attach: function (context, settings) { 
      ////////////////////////////////////////////////////////////////////////
      //ON READY FUNCTION
      $(document).ready(function() {
	for (var i =0; i<= 10; i++) {
	  var var_prefix = 'edit-field-show-scheduling-und-' + i;
	  var start_time_div_id = var_prefix + '-field-start-time';
	  var start_date_div_id =  var_prefix + 
	    '-field-show-schedule-start-date-und-0-value';
	
	  var extra_date_wrapper_div_id = 'field-show-scheduling-und-' + i 
	    + '-field-show-schedule-start-date-add-more-wrapper';

	  //MOVE THE DIV CONTAINING THE START DATE WIDGET OUT OF ITS 
	  //SPECIAL WRAPPER
	  $('#' + start_date_div_id).insertBefore($('#' + start_time_div_id));
	
	  //REMOVE THE SPECICAL WRAPPER FOR THE DATE WIDGET
	  $('#' + extra_date_wrapper_div_id).parent().remove();
	  
	  cmShowRequestUpdateScheduleFields(i, 1);
	}
      });
      ////////////////////////////////////////////////////////////////////////
      //CHANGE FUNCTION FOR LIVESOURCE DROPDOWN
      $("select[id$='field-live-source-und']", context).change(function() {
	var row_index = $(this).attr('id').substring(31,32);
	cmShowRequestUpdateScheduleFields(row_index,0);
      });
      ////////////////////////////////////////////////////////////////////////
      //CHANGE FUNCTION FOR CHANNEL DROPDOWN
      $("select[id$='field-airing-channel-und']", context).change(function() {
	var row_index = $(this).attr('id').substring(31,32);
	cmShowRequestUpdateScheduleFields(row_index, 0);
      });
      ////////////////////////////////////////////////////////////////////////
      //CHANGE FUNCTION FOR START DATE WIDGET
      $("input[id$='field-show-schedule-start-date-und-0-value-datepicker-popup-0']", context).change(function() {
	var row_index = $(this).attr('id').substring(31,32);
	cmShowRequestUpdateScheduleFields(row_index, 0);

      });
      ////////////////////////////////////////////////////////////////////////
      //function is passed a row index and will decide how to display the  
      //fields for scheduling information (used to auto create airings)  
      function cmShowRequestUpdateScheduleFields(row_index, is_initial_load) {
	var none_value = "_none";
	var var_prefix = 'edit-field-show-scheduling-und-' + row_index;
	var live_source_id =  var_prefix + '-field-live-source-und';
	var channel_id =  var_prefix + '-field-airing-channel-und';
	var start_time_id =  var_prefix + '-field-start-time-und';

	var start_date_id =  var_prefix + 
	  '-field-show-schedule-start-date-und-0-value-datepicker-popup-0';

	var live_source = $('#' + live_source_id).val(); 
	var channel = $('#' + channel_id).val(); 
	var start_date = $('#' + start_date_id).val();
	var start_time = $('#' + start_time_id).val(); 

	var item = new Date();
        
	if (!channel) {
          return;
        }
	//IF ITS NOT THE PREMIERE ROW, DISABLE SOURCE
	if (row_index != 0) {
	  $('#' + live_source_id).attr("disabled", "disabled");
	}

	if (channel == none_value) {
          $('#' + start_date_id).val('');
          $('#' + start_time_id).val(none_value);
          $('#' + start_date_id).parent().parent().hide();
          $('#' + start_time_id).parent().parent().hide();
        }
        //HIDE TIME IF WE DONT HAVE BOTH THE CHANNEL AND A START DATE    
        else if (channel == none_value || start_date == "") {
          $('#' + start_date_id).parent().parent().show();
          $('#' + start_time_id).parent().parent().hide();
          $('#' + start_time_id).val(none_value);
        }
	else {
	  $('#' + start_date_id).parent().parent().show();
          $('#' + start_time_id + ' option:gt(0)').remove();
          $('#' + start_time_id).parent().parent().show();

	  var show_id = window.location.pathname.split("/")[2]
          var cm_agd_url = '/admin/programming/show_request/ajax_times/' +
            live_source + '/' + channel + '/' + show_id +
	    "?date=" + encodeURIComponent(start_date);

          $.getJSON(cm_agd_url, function(data){
            $.each(data, function(i,item){
              $('#' + start_time_id).append($("<option></option")
                                            .attr("value", item.time_id)
                                            .text(item.time_id));
              $('#' + start_time_id).val(start_time);
            });
          });

	  var date_object = new Date(Date.parse(start_date));
	  var date_arg = date_object.getFullYear() + '-' + 
	    (1 + date_object.getMonth()) + '-' + date_object.getDate();

	  var channel_url = '/admin/programming/airings/day/channel/' +
	    date_arg + '/' + channel;

	  
	  var channel_link = "<div id=cm_show_request_channel_link_" +
	    row_index + ">" +
	    "<br/><a target = '_blank' href='" + channel_url + 
	    "'>Channel Listing</a></div>";


	  var source_url = '/admin/programming/airings/day/source/' +
	    date_arg + '/' + live_source;

	  
	  var source_link = "<div id=cm_show_request_source_link_" +
	    row_index + ">" +
	    "<a target = '_blank' href='" + source_url + 
	    "'>Source Listing</a></div>";
 
	  $('#cm_show_request_channel_link_' + row_index).remove();
	  $('#' + start_time_id).parent().parent().append(channel_link);
	    $('#cm_show_request_source_link_' + row_index).remove();

	  if (live_source != none_value) {
	    $('#' + start_time_id).parent().parent().append(source_link);
	  }

	}

	//console.log(row_index + " yo " + item.toTimeString());

      }

    }};  
}) (jQuery);
