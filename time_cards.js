var employees = [];
var pay_period_start;
var pay_period_start_day;
var pay_period_stop;

class Employee{
    emp_id;
    name;
    work_days;
    hour_count;

    constructor(emp_id, name){
        console.log("    *    *    4    *    *    *");
        console.log("Running (employee) constructor for " + name + "...");
        this.emp_id = emp_id;
        this.name = name;
        this.work_days = [];
        this.hour_count = 0;
        this.build_pp_work_days();
    }

    build_pp_work_days(){
        console.log("    *    *    4.1  *    *    *");
        console.log("Running build_pp_work_days for " + this.name+ "...");
        var wd_year = parseInt(String(pay_period_start).split("-")[0]);
        var wd_month = parseInt(String(pay_period_start).split("-")[1]);
        var wd_start = parseInt(String(pay_period_start).split("-")[2]);
        
        //console.log(String(pay_period_start).split("-")[2]);
        //console.log("wd_start: " + wd_start);
        var wd_curr_day = wd_start;
        var wd_end = parseInt(String(pay_period_stop).split("-")[2]);
        //console.log("wd_end " + wd_end);
        var wd_day_num = parseInt(pay_period_start_day);
        
        for (let i=wd_start; i<(wd_end+1); i++) {
            var wd_date = wd_year + "-" + wd_month + "-" + i;
            let temp_work_day = new Work_Day(wd_date, map_days(wd_day_num));
            //console.log("wd_date " + wd_date);
            //console.log(temp_work_day);
            this.work_days.push(temp_work_day);
            wd_day_num++;
        }
    }
}

class Work_Day{
    emp_id;
    date;
    day;
    work_periods = [];
    min_count;
    manual_lunch;

    constructor(date, day){
        console.log("    *    *    *    5    *    *");
        console.log("Running (work_day) constructor...");
        this.date = new Date(date);
        //console.log(this.date);
        this.day = day;
        this.min_count = 0;
        this.manual_lunch = false;
    }

    add_work_period(work_period){
        this.work_periods.push(work_period);
        this.min_count += parseInt(work_period.length);
    }

    get_day_info(){
        console.log("Day: " + this.day);
        console.log("Date: " + this.date);
    }

    collect_wp_lengths(){
        var total_length = 0;
        this.work_periods.forEach(wp => {
            total_length += wp.wp_total_min;
            console.log("# wps: " + this.work_periods.length);
            console.log(wp);
            console.log("mins_logged: " + this.work_periods[0].wp_total_min);
        });

        if(this.manual_lunch){
            total_length -= 30;
        }

        this.min_count = total_length;
        console.log("total -> " + this.min_count);
        this.push_wp_totals_to_hour_log();
    }

    mins_to_hr_min_string(){
        var p_hrs = Math.trunc(parseInt(this.min_count)/60);
        var p_mins = parseInt(this.min_count)%60;
        return p_hrs + " Hrs " + p_mins + " Min";
    }

    push_wp_totals_to_hour_log(){
        document.getElementById(date_idx_to_id(document.getElementById("curr_day_p").dataset.date_idx)).innerHTML = this.mins_to_hr_min_string();
    }

    toggle_manual_lunch(){
        var temp_ml = this.manual_lunch;
        this.manual_lunch = !this.manual_lunch;
        console.log("ML was '" + temp_ml + "' now it is '" + this.manual_lunch + "'");
    }
}

class Work_Period{
    emp_id;
    period_id;
    start_time;
    stop_time;
    rough_start_time;
    rough_stop_time;
    wp_total_min;

    constructor(emp_id, start, stop, rough_start, rough_stop){
        console.log("    *    *    *    *    *    *    *    9");
        console.log("(work_period) constructor - RUNNING.");
        this.emp_id = emp_id;
        this.start_time = start;
        this.stop_time = stop;
        this.rough_start_time = rough_start;
        this.rough_stop_time = rough_stop;
        console.log("Rough Start: " + this.rough_start_time);
        console.log("Rough Stop: " + this.rough_stop_time);

        this.wp_total_min = 0;
        this.calculate_length();
        this.period_id = this.generate_period_id();
    }

    generate_period_id(){

    }

    calculate_length(){
        this.wp_total_min = this.stop_time - this.start_time;
        console.log("length: " + this.wp_total_min);
        console.log("start: " + this.start_time);
        console.log("stop: " + this.stop_time);
        
    }
    /*
    mins_to_hr_min_string(){
        var p_hrs = Math.trunc(parseInt(this.wp_total_min)/60);
        var p_mins = parseInt(this.wp_total_min)%60;
        return p_hrs + " Hrs " + p_mins + " Min";
    }
    */
}

//
/*    -    -    -    -    -    1    -    -    -    -    */
//
function estimate_period_start(){
    console.log("1    *    *    *    *    *    *");
    console.log("Running estimate_period_start...");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var start_dd = dd;
    var end_dd = dd;
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    if(parseInt(dd) > 15){
        var d = new Date(yyyy, mm-1, 15);
        start_dd = 15;
        end_dd = getDaysInMonth(mm,yyyy);
    }
    else{
        var d = new Date(yyyy, mm, 1);
        start_dd = "01";
        end_dd = 14;
    }

    var start_day = yyyy + '-' + mm + '-' + start_dd;
    var end_day = yyyy + '-' + mm + '-' + end_dd;
    
    document.getElementById('start_date').value = start_day;
    document.getElementById('end_date').value = end_day;

    pay_period_start_day = d.getDay();
    update_hour_log_days(pay_period_start_day, mm, start_dd);
}

//
/*    -    -    -    -    -    2    -    -    -    -    */
//
function set_reset_pay_period(){
    console.log("    2    *    *    *    *    *");
    console.log("Running set_reset_pay_period...");

    // SET
    if(parseInt(document.getElementById("check_button").dataset.color) == 0){
        pay_period_start = document.getElementById("start_date").value;
        pay_period_stop = document.getElementById("end_date").value;
        document.getElementById("check_button").src="images/icons/green_checkmark.png";
        document.getElementById("check_button").dataset.color = 1;
        document.getElementById("start_date").disabled = true;
        document.getElementById("end_date").disabled = true;
        document.getElementById("employee_sel").disabled = false;
    }

    // RESET
    else{
        estimate_period_start();
        document.getElementById("check_button").src="images/icons/white_checkmark.png";
        document.getElementById("check_button").dataset.color = 0;
        document.getElementById("start_date").disabled = false;
        document.getElementById("end_date").disabled = false;
    }
}

//
/*    -    -    -    -    -    3    -    -    -    -    */
//
function build_out_employees(){
    console.log("    *    3    *    *    *    *");
    console.log("Running build_out_employees...");

    var temp_employees = document.getElementById('employee_sel').options;
    
    for (let index=0; index<temp_employees.length-1; index++) {
        console.log(temp_employees[index].value);
        var temp_employee = new Employee(index, temp_employees[index].value);
        employees.push(temp_employee);
    }
}

//
/*    -    -    -    -    -    6    -    -    -    -    */
//
function enable_in_time(p_num){
    console.log("    *    *    *    *    6    *");
    console.log("Running enable_in_time...");
    document.getElementById("in_time_" + p_num).disabled = false;
}

function enable_out_time_input(id){
    var temp_id = id.replace('in', 'out');
    document.getElementById(temp_id).disabled = false;
    document.getElementById(temp_id).value = '';
}

function jump_to_next(curr_id, flag, iter){
    // 0 - use param id
    // 1 - convert 'in' id to 'out' id
    // 2 - convert 'out' id to 'in' id

    out_time_0_p
    var new_id = curr_id;

    console.log("IN id: " + curr_id);
    if(iter > 0){
        var id_arr = curr_id.split("_");
        id_arr[2] = parseInt(id_arr[2]) + iter;
        new_id = id_arr[0] + "_" + id_arr[1] + "_" + id_arr[2];
    }
    console.log("OUT id: " + new_id);

    switch(flag) {
        case 0:
            document.getElementById(new_id).focus();
            break;
        case 1:
            document.getElementById(new_id.replace("in", "out")).focus();
            break;
        case 2:
            document.getElementById(new_id.replace("out", "in")).focus();
            break;
        default:
            break;
    }
}

//
/*    -    -    -    -    -    7    -    -    -    -    */
//
function smooth_time(id){
    console.log("    *    *    *    *    *    7");
    console.log("Running smooth_time...");
    var split_time_string = document.getElementById(id).value.split(":");

    var hour = parseInt(split_time_string[0]);
    var min = parseInt(split_time_string[1]);
    if(min<8){
        min = 00;
    }
    else if(7<min && min<23){
        min= 15;
    }
    else if(22<min && min<38){
        min= 30;
    }
    else if(37<min && min<53){
        min= 45;
    }
    else if(min>52){
        hour += 1;
        min = 00;

    }
    else{
        console.log("ERROR uncaught time!")
    }

    var adj_id = id +"_p";
    document.getElementById(adj_id).dataset.minutes = convert_to_min(hour, min);
    document.getElementById(adj_id).innerHTML = pad(hour, 2) + ":" + pad(min, 2);
}

function convert_to_min(hour, min){
    return min + (hour*60);
}

//
/*    -    -    -    -    -    8    -    -    -    -    */
//
function build_wp(id){
    console.log("    *    *    *    *    *    *    8");
    console.log("Running build_wp...");

    var rough_stop = document.getElementById(id).value;
    var temp_id = id + "_p";
    var temp_stop =  document.getElementById(temp_id).dataset.minutes;
    var temp_id = temp_id.replace("out", "in");
    var temp_start = document.getElementById(temp_id).dataset.minutes;
    var rough_start = document.getElementById(temp_id.replace("_p", "")).value;

    var temp_wp = new Work_Period(document.getElementById('employee_sel').selectedIndex, temp_start, temp_stop, rough_start, rough_stop);
    var selected_work_day = 0;
    employees[document.getElementById('employee_sel').selectedIndex].work_days[selected_work_day].work_periods.push(temp_wp);
    employees[document.getElementById('employee_sel').selectedIndex].work_days[selected_work_day].collect_wp_lengths();
    
}

function select_employee(name){
    
    console.log("Running select_employee...");
}

function enable_and_reset_form(div){
    console.log("Running 'enable_and_reset_form...")
    /*
    var all_fields = document.getElementById(div).querySelectorAll(".time_input_div"); 
    all_fields.forEach(input => {
        console.log("Enabling " + input.id);
        document.getElementById(input.id).disabled = false;
        document.getElementById(input.id).value = '';
    });
    */
    document.getElementById("in_time_0").disabled = false;
}

function build_employee(input_id, input_name){
    var curr_employee = new Employee(input_id, input_name);
    employees.push(curr_employee);
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function iterate_inputs(div_id){
    var inputs = Array.prototype.slice.call(div_id.querySelectorAll('input'));

    inputs.forEach(input => {
        //console.log(input.id);
        smooth_time(input.id);
    });
    calculate_hours_worked();
}

function calculate_hours_worked(){
    document.getElementById('period_1').dataset.minutes = document.getElementById('lunch_start_p').dataset.minutes - document.getElementById('in_time_p').dataset.minutes;
    convert_min_to_hrs(document.getElementById('period_1').dataset.minutes, 'period_1');

    document.getElementById('period_2').dataset.minutes = document.getElementById('out_time_p').dataset.minutes - document.getElementById('lunch_end_p').dataset.minutes;
    convert_min_to_hrs(document.getElementById('period_2').dataset.minutes, 'period_2');

    convert_min_to_hrs((parseInt(document.getElementById('period_1').dataset.minutes)+parseInt(document.getElementById('period_2').dataset.minutes)), 'total_hours_p');
}

function convert_min_to_hrs(min_in, period){
    var min = min_in % 60;
    var hrs = Math.floor(min_in / 60);
    console.log("In: "+ min_in);
    console.log("Hours: " + hrs);
    console.log("Min: " + min);

    document.getElementById(period).innerHTML = hrs + " hrs " + min + " min";
}

function getDaysInMonth(month,year) {
    return new Date(year, month+1, 0).getDate();
};

function update_hour_log_days(start_day, month, start_date){
    let temp_start_day = start_day;
    let temp_start_date = start_date;

    var hour_log_day_labels = get_hour_log_day_labels();

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    document.getElementById('curr_day_p').innerHTML = map_days(temp_start_day) + " - " + months[parseInt(month)-1]  + " " + temp_start_date + " 2022";

    for (let log_id=0; log_id<hour_log_day_labels.length; log_id++) {
        //console.log("Setting '" + hour_log_day_labels[log_id] + "' to " + days[start_day]);
        document.getElementById(hour_log_day_labels[log_id]).innerHTML = map_days(temp_start_day) + " - (" + month + "/" + temp_start_date + "):";
        temp_start_day++;
        temp_start_date++;
        if(temp_start_day == 7){
            temp_start_day = 0;
        }
    }
    // Highlight the starting day
    highlight_date_log(hour_log_day_labels[0].replace("label", "log"));
}

function map_days(day_num){
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var filtered_day_num = day_num % 7;
    return days[filtered_day_num];
}

function get_hour_log_day_labels(){
    var labels =[]
    for(let i=0; i<3; i++){
        for(let j=0; j<7; j++){
            let id_string = i + "_" + j + "_hour_label";
            labels.push(id_string);
        }
    }
    return labels;
}

function highlight_date_log(id){
    console.log("Running highlight_date_log...");
    document.getElementById(id).style.border = '1px solid #0ecc02';
    document.getElementById(id).style.boxShadow = '2px 2px #7fcc7a';
    document.getElementById(id).style.background = '#f3fff2';
    select_day_hour_log(id);

    // Set Current Day & Current Day Index
    document.getElementById("curr_day_p").innerHTML = document.getElementById(id.replace("log", "label")).innerHTML;
    document.getElementById("curr_day_p").dataset.date_idx = date_id_to_idx(id);
}

function select_day_hour_log(id){
    var hour_log_day_labels = get_hour_log_day_labels();
    var hour_log_day_log_ids = [];

    hour_log_day_labels.forEach(element => {
        hour_log_day_log_ids.push(element.replace("label", "log"));
    });

    hour_log_day_log_ids.forEach(day => {
        if(day != id){
            document.getElementById(day).style.border = '1px solid rgb(112, 111, 111)';
            document.getElementById(day).style.boxShadow = 'none';
            document.getElementById(day).style.background = '#ffffff';
        }
        else{
            console.log("MATCH");
        }
    });
}

function date_id_to_idx(id){
    var idx_array = id.split("_");
    return ((parseInt(idx_array[0]*7)) + parseInt(idx_array[1])); 
}

function date_idx_to_id(idx){
    return (Math.trunc(parseInt(idx)/7)) + "_" + (parseInt(idx)%7) + "_hour_log"; 
}

function hide_labels(){
    console.log("Running hide_labels...");
    document.getElementById('in_time_2_label').disabled = 'true';
    document.getElementById('in_time_2_label').hidden = 'true';
    document.getElementById('in_time_2_label').display = 'none';
}

function select_deselect_button(button_id){
    console.log("toggling " + button_id);
    if( document.getElementById(button_id).classList.contains('selected')){
        document.getElementById(button_id).classList.remove('selected');
    }
    else{
        document.getElementById(button_id).classList.add('selected');
    }
}

function enable_button(id){
    document.getElementById(id).disabled = false;
}

function disable_button(id){
    document.getElementById(id).disabled = true;
}

function toggle_manual_lunch(){
    employees[document.getElementById('employee_sel').selectedIndex].work_days[document.getElementById('curr_day_p').dataset.date_idx].toggle_manual_lunch();
}

function enable_period_input(){
    if(document.getElementById('in_time_2').disabled == true){
        document.getElementById('add_time_period_div').gridRow = '5/6';
        document.getElementById('add_manual_lunch_div').gridRow = '7/8';
        document.getElementById('in_time_2').disabled = false;
        document.getElementById('out_time_2').disabled = false;
        document.getElementById('in_time_2_label').style.visibility='visible';
    }
}

function clear_time_inputs(){
    for (let i=0; i<4; i++) {
        document.getElementById('in_time_' + i).value = null;
        document.getElementById('out_time_' + i).value = null;
    }
}

function load_user_inputs(){
    var sel_emp_idx = document.getElementById('employee_sel').selectedIndex;
    var sel_date = document.getElementById('curr_day_p').dataset.date_idx;
    var input_num = 0;
    var num_wp = employees[sel_emp_idx].work_days[sel_date].work_periods.length;

    employees[sel_emp_idx].work_days[sel_date].work_periods.forEach(wp => {

        
        document.getElementById('in_time_' + input_num).value = wp.rough_start_time;
        document.getElementById('out_time_' + input_num).value = wp.rough_stop_time;
        input_num++;
    });
}