
function displayMessage(message, type='error'){
	var element = $("<div>").text(message).addClass(type);
	if(type==='error'){
		console.error(message);
	} else {
		console.log(message);
	}
	element.appendTo('#displayArea');
}

function testMethod( object, method ){
	try{
		if(object[method] === undefined){
			throw 'missing method '+method+' in ' + object.constructor.name;
		}
	}
	catch (error){
		displayMessage(error);
		return false;
	}
}

function modalTests_featureset1(){
	displayMessage('--Modal test', 'header');
	if(typeof Modal === 'undefined' ){
		displayMessage('Modal object does not exist.  Check exercises/modal.js and make sure the object is defined still and there are no syntax errors in the console');
		return false;
	}
	var modal = new Modal('#modalShadow', '#modalBody', '#modalMessage');
	window.test = 'not set';
	if(testMethod( modal, 'init')) return
	try{
		modal.onClose = ()=>{  
			displayMessage('modal callback passes', 'message');
			window.test = 'set';
		}
	} catch( error ){
		displayMessage('error assigning or calling modal callback: '+ error);
		return false;
	}
	modal.init();
	if($("#modalShadow").css('display')!=='none'){
		displayMessage('modal.init failed to hide shadow of modal');
		return false
	}
	if($("#modalBody").css('display')!=='none'){
		displayMessage('modal.init failed to hide body of modal');
		return false;
	}
	if(testMethod(modal, 'show')) return;
	modal.show();
	if($("#modalShadow").css('display')==='none'){
		displayMessage('modal.show failed to show shadow of modal');
		return false
	}
	if($("#modalBody").css('display')==='none'){
		displayMessage('modal.show failed to show body of modal');
		return false;
	}
	displayMessage('modal.show worked correctly', 'message');
	if(testMethod(modal, 'updateContents')) return;
	modal.updateContents('this is a test');
	if($("#modalMessage").text() !== 'this is a test'){
		displayMessage('modal.updateContents failed to update contents of modal to "this is a test"');
		return false;		
	}
	displayMessage('modal.updateMessage worked correctly', 'message');
	if(testMethod(modal, 'hide')) return;
	modal.hide();
	if($("#modalShadow").css('display')!=='none'){
		displayMessage('modal.hide failed to hide shadow of modal');
		return false
	}
	if($("#modalBody").css('display')!=='none'){
		displayMessage('modal.hide failed to hide body of modal');
		return false;
	}
	displayMessage('modal.hide worked correctly', 'message');
	modal.show();
	$("#modalShadow").click();
	if($("#modalShadow").css('display')!=='none'){
		displayMessage('modal.hide failed to hide shadow of modal after shadow click');
		return false
	}
	if($("#modalBody").css('display')!=='none'){
		displayMessage('modal.hide failed to hide body of modal after shadow click');
		return false;
	}
	if(window.test!=='set'){
		displayMessage('modal.onClick failed to be called correctly, function didn\'t get called?');
		return false		
	}
	displayMessage('modal callback passes click test', 'message');
	displayMessage('click on modal shadow worked correctly', 'message');
	return true;
}

function inputTests_featureset2(){
	displayMessage('--Input test', 'header');
	if($("#testInput").length!==1){
		displayMessage('input #testInput no longer exists on the dom.  Check to make sure you haven\'t deleted it by accident');
		return false;
	}
	if(typeof Input === 'undefined' ){
		displayMessage('Input object does not exist.  Check exercises/input.js and make sure the object is defined still and there are no syntax errors in the console');
		return false;
	}
	var input = new Input($("#testInput"));
	displayMessage('Input object constructed ', 'message');

	if(testMethod(input, 'setPattern')) return;
	if(testMethod(input, 'getPattern')) return;
	var inputPattern = /^[a-zA-Z]{1,3}$/
	input.setPattern(inputPattern);
	var pattern = input.getPattern();
	if(!(pattern instanceof RegExp )){
		displayMessage('Input.getPattern should have returned a regular expression, returned ' + typeof pattern + ' instead');
		return false;
	}
	if(String(pattern) !== String( inputPattern)){
		displayMessage('Input.getPattern did not return the correct pattern.  ' + String(inputPattern) + ' was given, ' + String(pattern) + ' was retrieved');
		return false;
	}
	displayMessage('Input.setPattern and Input.getPattern passed tests', 'message');
	if(testMethod(input, 'test')) return;
	var inputString = 'abc'
	$("#testInput").val( inputString );
	var testResult = input.test();
	if(typeof testResult !== 'object'){
		displayMessage('Input.test should return an object with keys of result and an optional error property, returned '+typeof testResult + ' instead ');
		return false;
	}
	if(testResult.result !== true){
		displayMessage('Input.test was testing "'+inputString+'" in the input with a pattern of '+String(inputPattern)+ ' , result should have been true but was ' + testResult.result);
		return false;
	}
	inputString = '12345';
	$("#testInput").val( inputString );
	testResult = input.test();
	if(typeof testResult !== 'object'){
		displayMessage('Input.test should return an object with keys of result and an optional error property, returned '+typeof testResult + ' instead ');
		return false;
	}
	if(testResult.result !== false){
		displayMessage('Input.test was testing "'+inputString+'" in the input with a pattern of '+String(inputPattern)+ ' , result should have been false but was ' + testResult.result);
		return false;
	}	
	if(testResult.error !== 'pattern'){
		displayMessage('Input.test was testing "'+inputString+'" in the input with a pattern of '+String(inputPattern)+ ' , error should have been "pattern" but was ' + testResult.error);
		return false;
	}	
	displayMessage('Input pattern tests passed ', 'message');
	var inputPattern = /^-?[0-9]*$/
	input.setPattern(inputPattern);

	if(testMethod(input, 'setRange')) return;
	if(testMethod(input, 'getRange')) return;
	input.setRange(1, 10);
	var range = input.getRange();
	if(typeof range !== 'object'){
		displayMessage('Input.getRange did not return an object.  It must return an object with a min key and a max key');
		return false;
	}
	if(range.min !== 1 || range.max!==10){
		displayMessage('Input.getRange did not return the correct value or Input.setRange did not store the correct input.  Should have been {min: 1, max: 10} and got '+ JSON.stringify(range));
		return false;
	}
	testResult = input.test();
	if(testResult.result !== false){
		displayMessage('Input.test did not return the correct value of false, as '+inputString+' is beyond 10. got ' + testResult.result + ' instead');
		return false
	}
	if(testResult.result !== false){
		displayMessage('Input.test did not return the error of "range", as '+inputString+' is beyond 10. got ' + testResult.error + ' instead');
		return false
	}
	inputString = '8';
	$("#testInput").val( inputString );
	testResult = input.test();
	if(testResult.result !== true){
		displayMessage('Input.test did not return the correct value of true, as '+inputString+' is between 1 and 10. got ' + testResult.result + ' instead');
		return false
	}	
	inputString = '-8';
	$("#testInput").val( inputString );
	testResult = input.test();
	if(testResult.result !== false){
		displayMessage('Input.test did not return the correct value of false, as '+inputString+' is less than 1. got ' + testResult.result + ' instead');
		return false
	}
	if(testResult.result !== false){
		displayMessage('Input.test did not return the error of "range", as '+inputString+' is less than 1. got ' + testResult.error + ' instead');
		return false
	}
	displayMessage('Input range tests passed ', 'message');
	if(testMethod(input, 'showError')) return;
	if(testMethod(input, 'hideError')) return;
	var testMessage = 'testMessage';
	input.showError(testMessage);
	var testError = $(".inputError");
	if(testError.length!==1){
		displayMessage('Error with Input.showError, no dom element with a class of .inputError exists');
		return false;
	}
	var errorPos = testError.position();
	var inputPos = $("#testInput").position()
	if(errorPos.left!==inputPos.left || errorPos.top <= inputPos.top){
		displayMessage('Error with Input.showError: position of .inputError element is not below the position of the input. ');
		return false;
	}
	if(testError.text() !== testMessage){
		displayMessage('Error with Input.showError: text in message is wrong.  Should be "'+testMessage + '" but was "'+testError.text() + '" instead');
		return false;
	}
	if($("#testInput").css('display')==='none'){
		displayMessage('Error with Input.showError: element exists, but is not visible');
		return false;
	}
	displayMessage('Input.showError tests passed', 'message');
	input.hideError();
	var testError = $(".inputError");
	if(testError.length!==0){
		displayMessage('Error with Input.hideError, the element appears to still exist');
		return false;
	}	
	displayMessage('Input.hideError tests passed', 'message');
	var input2 = new Input($("#testInput2"));
	displayMessage('second Input object constructed ', 'message');
	input2.setPattern(/^[aeiou]{1,5}$/);
	$("#testInput2").val('123');
	var result2 = input2.test();
	input2.showError(result2.error);
	var testError = $(".inputError");
	if(testError.length!==1){
		displayMessage('Error with Input.showError, the 2nd input did not show an error appropriately');
		return false;
	}	
	$("#testInput2").val('moo');
	var result = input.test();
	input.showError(result.error);
	var testError = $(".inputError");
	if(testError.length!==2){
		displayMessage('Error with Input.showError, both inputs should show an error');
		return false;
	}
	if(testError[0].innerText!=='range' || testError[1].innerText !== 'pattern'){
		displayMessage('input 1 error message should be "range" and input 2 error message should be "pattern", but got '+testError[0].innerText + ' and ' + testError[1].innerText + ' instead');
	}
	input.hideError();
	testError = $(".inputError");
	if(testError.length!==1){
		displayMessage('Error with Input.hideError, there should be one error remaining, but currently there is/are '+testError.length);
		return false;
	}
	input2.hideError();
	testError = $(".inputError");
	if(testError.length!==0){
		displayMessage('Error with Input.hideError, there should be no error showing, but currently there is/are '+testError.length);
		return false;
	}
	displayMessage('multiple Input objects constructed and tested: passed', 'message');

	displayMessage('Input passed all tests ', 'message');
	return true;
}

function colorSquareTests_featureset3(){
	displayMessage('--colorSquare test', 'header');
	if($("#colorSquareArea").length!==1){
		displayMessage('#colorSquareArea no longer exists on the dom.  Check to make sure you haven\'t deleted it by accident');
		return false;
	}
	if(typeof ColorSquare === 'undefined' ){
		displayMessage('ColorSquare object does not exist.  Check exercises/input.js and make sure the object is defined still and there are no syntax errors in the console');
		return false;
	}
	var squareArray = [];
	var avaiableColor = ['red','blue','black','green'];
	var squareDomElements = [];
	var previousElement = null;
	var tempSquare = new ColorSquare(['red'],0,'test');
	if(testMethod(tempSquare, 'render')) return;
	var testSquareDom = tempSquare.render();
	displayMessage('ColorSquare.render method test start ', 'message');
	if(!testSquareDom.hasClass('test')){
		displayMessage('ColorSquare.render did not return a dom element with a given class of "test" had ' + testSquareDom.attr('class'))
		return false;
	}
	displayMessage('ColorSquare.render method test passed ', 'message');
	var neighborSquare = new ColorSquare(['red'],0,'test2');
	if(testMethod(tempSquare, 'neighbor')) return;
	try{
		tempSquare.neighbor = neighborSquare;
	} catch (error ){
		displayMessage('error while setting ColorSquare.neighbor: '+error);
		return false;
	}
	try{
		var test = tempSquare.neighbor;
		if(test.constructor !== ColorSquare){
			throw 'ColorSquare getter failed, did not return a ColorSquare object'
		}
	} catch (error ){
		displayMessage('error while getting ColorSquare.neighbor: '+error);
		return false;
	}
	displayMessage('ColorSquare.neighbor getter/setter passed ', 'message');
	displayMessage('ColorSquare starting multi-square tests ', 'message');

	for(var i = 0; i < avaiableColor.length; i++){
		var square = new ColorSquare(avaiableColor, i, 'colorSquare');
		squareArray.push( square );
		squareDomElements.push( square.render() );
		if(previousElement!==null){
			previousElement.neighbor = square;
		}
		previousElement = square;
	}
	$("#colorSquareArea").append(squareDomElements);
	var humanTests = ['red','blue','black','green'];
	var tests = ['rgb(255, 0, 0)', 'rgb(0, 0, 255)','rgb(0, 0, 0)','rgb(0, 128, 0)']
	displayMessage('clicking on first square ', 'message');
	squareDomElements[0].click();
	tests.push( tests.shift());
	humanTests.push( humanTests.shift())
	if(!tests.every(( requiredColor, index) => { 
		//console.log('*'+requiredColor+'*','*'+squareDomElements[index].css('background-color')+'*');
		if(squareDomElements[index].css('background-color') !== requiredColor){
			displayMessage('error while clicking.  First element should have had a color of '+requiredColor+' and had : '+squareDomElements[index].css('background-color'));
			return false;
		} else {
			displayMessage(requiredColor + ' switch passed ', 'message');
			return true;
		}
	})){
		displayMessage('ColorSquare.handleClick test failed: color pattern should have been '+humanTests);
		return false;
	}
	displayMessage('clicking on first square: passed ', 'message');
	displayMessage('clicking on third square ', 'message');
	squareDomElements[2].click();
	humanTests.splice(2,1);
	tests.splice(2,1);
	humanTests.push(humanTests[0]);
	tests.push(tests[0]);
	if(!tests.every(( requiredColor, index) => { 
		//console.log('*'+requiredColor+'*','*'+squareDomElements[index].css('background-color')+'*');
		if(squareDomElements[index].css('background-color') !== requiredColor){
			displayMessage('error while clicking.  First element should have had a color of '+requiredColor+' and had : '+squareDomElements[index].css('background-color'));
			return false;
		} else {
			displayMessage(requiredColor + ' switch passed ', 'message');
			return true;
		}
	})){
		displayMessage('ColorSquare.handleClick test failed: color pattern should have been '+humanTests);
		return false;
	}
	displayMessage(' 2nd click tests passed ', 'message');
	return true;
}

var testFunctions = ['modalTests_featureset1', 'inputTests_featureset2', 'colorSquareTests_featureset3']

var i = 0;
while( i<testFunctions.length && window[testFunctions[i]]() === true){
	i++;
}

displayMessage(' All tests passed! ', 'header');


















