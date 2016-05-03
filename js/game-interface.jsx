var AnswerFrame = React.createClass({
    render:function(){
        // get the selected number from Game component and render here
        var selectNumbers = this.props.selectNumbers;
        var unselectClick = this.props.unSelectNumberClick;
        var numbers = selectNumbers.map(function(value){
            return (
                <span className="number" onClick={unselectClick.bind(null,value)}>
                    {value}
                </span>
            )
        });

        return (
            <div id="answer-frame">
                <div className="well">
                    {numbers}
                </div>
            </div>
        );
    }
});

var StarsFrame = React.createClass({
    render:function(){
        var numberOfStars = this.props.numberOfStars;
        var stars = [];
        for(var i = 0; i < numberOfStars; i++)
        {
            stars.push(
                <span className="glyphicon glyphicon-star"></span>
            );
        }
        return (
            <div id="stars-frame">
                <div className="well">
                    {stars}
                </div>
            </div>
        );
    }
});

var ButtonFrame = React.createClass({
    render:function(){
        var disabled = (this.props.selectNumbers.length === 0) ? "disabled": "";
        var checkResultClick = this.props.checkResultClick;
        var className = "btn btn-primary btn-lg";
        var status = this.props.status;
        var spanIcon =[];
        if(disabled == "")
        {
            if(status != null )
            {
                className += (status ?" btn-correct":" btn-incorrect");
                if(status)
                {
                    // if this is the correct answer, the second time click will trigger redraw
                    checkResultClick = this.props.redrawClick;
                    spanIcon.push(
                        <span className="glyphicon glyphicon-ok"></span>
                    );
                }
                else{
                    spanIcon.push(
                        <span className="glyphicon glyphicon-remove"></span>
                    );
                }
            }
        }
        if(spanIcon.length == 0)
        {
            spanIcon.push(
                <span>=</span>
            );
        }
        var reRollClick;
        var reRollNumber = this.props.reRollNumber;
        var reRollClass = "btn btn-warning btn-xs "
        if(reRollNumber == 0)
        {
            reRollClass += " disabled";
        }
        else {
             reRollClick = this.props.reRollClick
        }

        return (
            <div id="button-frame">
                <button className={className} disabled={disabled} onClick={checkResultClick} >
                    {spanIcon}
                </button>
                <br/>
                <button className={reRollClass} onClick={reRollClick}>
                    <span className="glyphicon glyphicon-refresh">{reRollNumber}</span>
                </button>
            </div>
        );
    }
});

var NumberFrame = React.createClass({
    updateParentState: function(value){
        // prevent used number to be clicked.
        if(this.props.usedNumbers.indexOf(value) < 0)
        {
            // this is the NumberFrame, we need to get the value of the click numbers
            var clickNumber = this.props.val;
            this.props.selectNumberClick(clickNumber);
        }
    },
    render:function(){
        var numbers = [];
        var selectedNumbersArray = this.props.selectNumbers;
        // get the update parent click function from props
        var clickNumFunc = this.props.selectNumberClick;
        var usedNumbers = this.props.usedNumbers;
        // NOTE: clickNumFunc.bind(null,i) : create a closure and bind the value to the function.

        for(var i = 1; i<=9 ;i++){
            var classAttrs = 'number select-' + ((selectedNumbersArray.indexOf(i) > -1) ? "true" : "false");
            if(usedNumbers.indexOf(i) > -1 )
            {
                classAttrs +=  " number-used";
                numbers.push(
                    <div className={classAttrs} >{i}</div>
                );
            }
            else
            {
                numbers.push(
                    <div className={classAttrs} onClick={clickNumFunc.bind(null,i)} >{i}</div>
                );
            }
        }
        return (
            <div id="number-frame">
                <div className="well">
                    {numbers}
                </div>
            </div>
        );
    }
});

var MessageFrame = React.createClass({
    render: function(){
        var winState = this.props.winState;
        var className = "well";
        var classPlayAgainBtn = "";
        var message = [];
        var resetClick = this.props.resetClick;
        switch (winState) {
            case true:
                message.push("You won!");
                break;
            case false:
                message.push(
                    <span>No possible answers! You lost.</span>
                );
                break;
            default:
                message.push("");
                className += " hidden";
                classPlayAgainBtn = "hidden"
                break;
        }
        return(
            <div id="message-frame" className={className}>
                <h2>{message}</h2>
                <button onClick={resetClick} className={classPlayAgainBtn}> Play Again? </button>
            </div>
        );
    }
});

var Game = React.createClass({
    getRandomValue: function (){
        return Math.floor( Math.random() * 9) + 1;
    },
    checkPossibleValue: function(newValue, usedNumbers){
        // check if the current results can produce the numberOfStars;
        var numberOfStars = newValue;
        var usedNumbers = usedNumbers;
        var isAnswerExisted = false;

        // loop through all the value
        // For each value, calculate the difference between number of stars and the value
        // If the remainder is not in the usedNumbers list, then the answer is available.
        for(var i = 1; i <= 9; i++)
        {
            var diff = numberOfStars - i;
            if( diff < 0)
            {
                break;
            }

            if(diff == 0 && usedNumbers.indexOf(i) < 0)
            {
                isAnswerExisted = true;
                break;
            }

            if(diff > 0 && usedNumbers.indexOf(i) < 0 && usedNumbers.indexOf(diff) < 0)
            {
                isAnswerExisted = true;
                break;
            }
        }
        return isAnswerExisted;
    },
    getInitialState: function(){
        var newNumberOfStars = this.getRandomValue();
        return {
                numberOfStars: newNumberOfStars,
                selectedNumbers : [],
                usedNumbers : [],
                correct: null,
                win: null,
                reRoll: 5
            };
    },
    resetClick: function(){
        var newNumberOfStars = this.getRandomValue();
        this.setState({
                numberOfStars: newNumberOfStars,
                selectedNumbers : [],
                usedNumbers : [],
                correct: null,
                win: null,
                reRoll: 5
            });
    },
    redraw: function(){

        // redraw the app when the answer is correct
        var newNumberOfStars = this.getRandomValue();
        var usedNumbers = this.state.usedNumbers;
        var winState = null;
        // if the usedNumbers length is 9 -> finish and win the game
        if(this.state.usedNumbers.length == 9)
            winState = true;
        else {
            // check if possible exist. if exist let the game continue
            var isAnswerExisted = this.checkPossibleValue(newNumberOfStars, usedNumbers);

            // Test function for checkPossibleValue
            //var isAnswerExisted = this.checkPossibleValue(9, [2,3,4,5,6,7,8,9]);

            // If reRoll is still positive, users can reRoll
            if(this.state.reRoll > 0)
                winState = null;
            else
                winState = (isAnswerExisted ? null : false);
        }

        this.setState({
                numberOfStars : newNumberOfStars,
                selectedNumbers : [],
                correct: null,
                win: winState
        });
    },
    selectNumber : function(value){
        var selectedNumbers = this.state.selectedNumbers;
        // if the value is not in the list, add it to the list and let react re-render
        if(selectedNumbers.indexOf(value) == -1)
        {
            this.setState(
                { selectedNumbers : selectedNumbers.concat(value) }
            );
        }
    },
    unSelectNumber : function(value){
        var selectedNumbers = this.state.selectedNumbers;
        var valueIndex = selectedNumbers.indexOf(value);

        // NOTE: There is an issue when use the line below in the setState. The array did not get removed correctly
        //       The correct way seems to be run this function before use setState
        selectedNumbers.splice(valueIndex,1);

        if(value > -1)
        {
            // remove the value from the selected number state array
            this.setState(
                {selectedNumbers: selectedNumbers}
            );
        }
    },
    reRollClick: function(){
        var reRoll = this.state.reRoll - 1;
        var newNumberOfStars = this.getRandomValue();

        // after reroll calculate winState;
        var winState = this.state.win;
        if(reRoll == 0)
        {
            var isAnswerExisted = this.checkPossibleValue(newNumberOfStars, this.state.usedNumbers);
            winState = (isAnswerExisted ? null : false);
        }

        this.setState({
            numberOfStars : newNumberOfStars,
            reRoll: reRoll,
            win : winState
        });
    },
    checkResult: function(){
        var numberOfStars = this.state.numberOfStars;
        var selectedNumbers = this.state.selectedNumbers;
        var usedNumbers = this.state.usedNumbers;
        var sum = 0;
        for(var i = 0 ; i < selectedNumbers.length; i++){
            sum += selectedNumbers[i];
        }

        var status = (sum == numberOfStars) ? true : false;
        // if it is correct add the numbers into the usedNumbers array
        if(status){
            usedNumbers = usedNumbers.concat(selectedNumbers);
        }

        this.setState({
            correct: status,
            usedNumbers: usedNumbers
        })
    },
    render:function(){
        return (
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div>
                    This is simple game implemented using React.js
                    Choose a number or a sum of numbers which equal to the numbers of stars.
                    You have 5 rerolls.
                </div>
                <br/>
                <div className="clearfix">
                    <StarsFrame numberOfStars={this.state.numberOfStars} />
                    <ButtonFrame selectNumbers={this.state.selectedNumbers} status={this.state.correct} checkResultClick={this.checkResult} redrawClick={this.redraw} reRollClick={this.reRollClick} reRollNumber={this.state.reRoll}/>
                    <AnswerFrame selectNumbers={this.state.selectedNumbers} unSelectNumberClick={this.unSelectNumber} />
                </div>
                <NumberFrame selectNumbers={this.state.selectedNumbers} usedNumbers={this.state.usedNumbers} selectNumberClick={this.selectNumber} />
                <MessageFrame winState={this.state.win} resetClick={this.resetClick} />
            </div>
        );
    }
});

React.render(
    <Game />, document.getElementById('container')
);

// TODO:
//      Check if the answer is correct
//      Check if the is no possible answer
//      Redraw button
