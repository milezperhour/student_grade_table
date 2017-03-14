/**
 * Define all global variables here
 */
var add;
var cancel;
var getData;
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array;
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var studentName;
var studentCourse;
var studentGrade;
var nameValue;
var courseValue;
var gradeValue;
/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    if (studentName.val()=='' || studentCourse.val()=='' || studentGrade.val()==''){
        return false;
    }else if(isNaN(studentGrade.val())){
        return false;
    }
    console.log('add button clicked');
    nameValue = studentName.val();
    courseValue = studentCourse.val();
    gradeValue = studentGrade.val();

    clearAddStudentForm();
    addStudent(); //to add student object to global array
}
/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked(){
    console.log("cancel button clicked");
    clearAddStudentForm();
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var student_object={name: nameValue, course: courseValue, grade: gradeValue};
    //student_array.push(student_object);
    console.log("student_array: ", student_array);

    createStudentAPIdata(student_object);
    calculateAverage();
    updateStudentList();
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    console.log('clear student form called');
    studentName.val('');
    studentCourse.val('');
    studentGrade.val('');
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(){
    console.log("calculateAverage called");
    if (student_array.length === 0){
        $('.label').text(0);
    }
    var avg;
    var total=0;
    for (var i = 0; i < student_array.length; i++) {
        var gradeNumber;
        gradeNumber = Number(student_array[i].grade);
        total += gradeNumber;
        avg = total / student_array.length;
        var multiplier = Math.pow(10, 2);
        avg = Math.round(avg * multiplier) / multiplier;
    }
    updateData(avg);
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(avg){
    $('.label').text(avg);
    updateStudentList();
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    $('tbody').html('');
    for (var i=0; i<student_array.length; i++){
        addStudentToDom(student_array[i]);
    }
}
/**
 * deleteClicked - deletes the row clicked on
 */
function deleteClicked(){
    console.log("DELETE BUTTON WAS CLICKED");
    var index = $(this).index('.delete');
    $(this).parents('tr').remove();
    console.log("student_array before object is removed: ", student_array);
    removeStudent(index);
}
/**
 * removeStudent - removes the student object from global array
 */
function removeStudent(index){
    console.log("remove student called");

    deleteStudentAPIdata(student_array[index], index); //ajax call before the index is removed from student_Array
    student_array.splice(index, 1);
    console.log("student_array after object is removed" + ": ", student_array);
    calculateAverage();
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj){
    var tr = $('<tr></tr>'); //creates a new table row
    var td = $('<td></td>'); //creates new table data cell

    td.text(studentObj.name);
    tr.append(td);
    $('tbody').append(tr);

    td = $('<td></td>');
    td.text(studentObj.course);
    tr.append(td);
    $('tbody').append(tr);

    td = $('<td></td>');
    td.text(studentObj.grade);
    tr.append(td);
    $('tbody').append(tr);

    var deleteButton = $('<button type="button" class="btn btn-danger delete"></button>'); //creates a button tag
    deleteButton = deleteButton.text('Delete');  //adds text to button

    td = $('<td></td>');
    td.append(deleteButton);
    tr.append(td);
    $('tbody').append(tr);

    $(deleteButton).click(deleteClicked);
    //clearAddStudentForm();
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    student_array = [];
    clearAddStudentForm();
}
/**
 * getStudentAPIdata - gets student API data using ajax call via POST
 */
function getStudentAPIdata(){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'POST',
        data: {
            api_key: 'cLM5crkuKX'
        },
        success: function(result){
            console.log(result);
            for (var i=0; i<result.data.length; i++){
                var student_object = {
                    name: result.data[i].name,
                    course: result.data[i].course,
                    grade: result.data[i].grade,
                    id: result.data[i].id
                };
                student_array.push(student_object);
                calculateAverage();
            }
        }
    })
}
/**
 * createStudentAPIdata - gets student API data using ajax call via POST
 * @param studentObj
 */
function createStudentAPIdata(studentObj){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'POST',
        data: {
            api_key: 'cLM5crkuKX',
            name: studentObj.name,
            course: studentObj.course,
            grade: studentObj.grade
        },
        success: function(result){
            if (result.success){
                console.log('success! api result: ', result);
                console.log('api student object: ', studentObj);
                var apiStudentObject = {
                    name: studentObj.name,
                    course: studentObj.course,
                    grade: studentObj.grade,
                    new_id: result.new_id
                };
                student_array.push(apiStudentObject);
                console.log(apiStudentObject);
                calculateAverage();

                $(".modal-body").html('');
                var h3 = $('<h3>',{
                    text: "Success in creating a student!"
                });
                $(".modal-body").append(h3);
                $("#resultModal").modal();
            }else{
                console.log("There was an error in creating a student object");
                $(".modal-body").html('');
                h3 = $('<h3>',{
                    text: "Error in creating a student!"
                });
                $(".modal-body").append(h3);
                $("#resultModal").modal();
            }
        }
    })
}
/**
 * deleteStudentAPIdata - deletes student API data using ajax call via POST
 */
function deleteStudentAPIdata(studentObj, idx){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'POST',
        data: {
            api_key: 'cLM5crkuKX',
            student_id: studentObj.new_id
        },
        success: function(result){
            if (result.success){
                console.log('DELETE success! api result: ', result);
                console.log('DELETED api student object: ', studentObj);
                removeStudent(idx);
                calculateAverage();

                $(".modal-body").html('');
                var h3 = $('<h3>',{
                    text: "Success in deleting a student!"
                });
                $(".modal-body").append(h3);
                $("#resultModal").modal();
            }else{
                console.log("There was an error in deleting a student");
                $(".modal-body").html('');
                h3 = $('<h3>',{
                    text: "Error in deleting a student!"
                });
                $(".modal-body").append(h3);
                $("#resultModal").modal();
            }
        }
    })
}
/**
 * getDataClicked - call getAPIdata when getData button is clicked
 */
function getStudentDataClicked(){
    console.log("getData Button clicked");
    getStudentAPIdata();
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    studentName = $('#studentName');
    studentCourse = $('#studentCourse');
    studentGrade = $('#studentGrade');
    student_array=[];
    add = $('.add');
    cancel = $('.cancel');
    getData = $('.getData');
    add.click(addClicked);
    cancel.click(cancelClicked);
    getData.click(getStudentDataClicked);
    calculateAverage();
    reset();
});