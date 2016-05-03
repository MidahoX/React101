var AnswerFrame = React.createClass({displayName: "AnswerFrame",
    render:function(){
        // get the selected number from Game component and render here
        var selectNumbers = this.props.selectNumbers;
        var unselectClick = this.props.unSelectNumberClick;
        var numbers = selectNumbers.map(function(value){
            return (
                React.createElement("span", {className: "number", onClick: unselectClick.bind(null,value)}, 
                    value
                )
            )
        });

        return (
            React.createElement("div", {id: "answer-frame"}, 
                React.createElement("div", {className: "well"}, 
                    numbers
                )
            )
        );
    }
});

var StarsFrame = React.createClass({displayName: "StarsFrame",
    render:function(){
        var numberOfStars = this.props.numberOfStars;
        var stars = [];
        for(var i = 0; i < numberOfStars; i++)
        {
            stars.push(
                React.createElement("span", {className: "glyphicon glyphicon-star"})
            );
        }
        return (
            React.createElement("div", {id: "stars-frame"}, 
                React.createElement("div", {className: "well"}, 
                    stars
                )
            )
        );
    }
});

var ButtonFrame = React.createClass({displayName: "ButtonFrame",
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
                        React.createElement("span", {className: "glyphicon glyphicon-ok"})
                    );
                }
                else{
                    spanIcon.push(
                        React.createElement("span", {className: "glyphicon glyphicon-remove"})
                    );
                }
            }
        }
        if(spanIcon.length == 0)
        {
            spanIcon.push(
                React.createElement("span", null, "=")
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
            React.createElement("div", {id: "button-frame"}, 
                React.createElement("button", {className: className, disabled: disabled, onClick: checkResultClick}, 
                    spanIcon
                ), 
                React.createElement("br", null), 
                React.createElement("button", {className: reRollClass, onClick: reRollClick}, 
                    React.createElement("span", {className: "glyphicon glyphicon-refresh"}, reRollNumber)
                )
            )
        );
    }
});

var NumberFrame = React.createClass({displayName: "NumberFrame",
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
                    React.createElement("div", {className: classAttrs}, i)
                );
            }
            else
            {
                numbers.push(
                    React.createElement("div", {className: classAttrs, onClick: clickNumFunc.bind(null,i)}, i)
                );
            }
        }
        return (
            React.createElement("div", {id: "number-frame"}, 
                React.createElement("div", {className: "well"}, 
                    numbers
                )
            )
        );
    }
});

var MessageFrame = React.createClass({displayName: "MessageFrame",
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
                    React.createElement("span", null, "No possible answers! You lost.")
                );
                break;
            default:
                message.push("");
                className += " hidden";
                classPlayAgainBtn = "hidden"
                break;
        }
        return(
            React.createElement("div", {id: "message-frame", className: className}, 
                React.createElement("h2", null, message), 
                React.createElement("button", {onClick: resetClick, className: classPlayAgainBtn}, " Play Again? ")
            )
        );
    }
});

var Game = React.createClass({displayName: "Game",
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
            React.createElement("div", {id: "game"}, 
                React.createElement("h2", null, "Play Nine"), 
                React.createElement("hr", null), 
                React.createElement("div", null, 
                    "This is simple game implemented using React.js" + ' ' +
                    "Choose a number or a sum of numbers which equal to the numbers of stars." + ' ' +
                    "You have 5 rerolls."
                ), 
                React.createElement("br", null), 
                React.createElement("div", {className: "clearfix"}, 
                    React.createElement(StarsFrame, {numberOfStars: this.state.numberOfStars}), 
                    React.createElement(ButtonFrame, {selectNumbers: this.state.selectedNumbers, status: this.state.correct, checkResultClick: this.checkResult, redrawClick: this.redraw, reRollClick: this.reRollClick, reRollNumber: this.state.reRoll}), 
                    React.createElement(AnswerFrame, {selectNumbers: this.state.selectedNumbers, unSelectNumberClick: this.unSelectNumber})
                ), 
                React.createElement(NumberFrame, {selectNumbers: this.state.selectedNumbers, usedNumbers: this.state.usedNumbers, selectNumberClick: this.selectNumber}), 
                React.createElement(MessageFrame, {winState: this.state.win, resetClick: this.resetClick})
            )
        );
    }
});

React.render(
    React.createElement(Game, null), document.getElementById('container')
);

// TODO:
//      Check if the answer is correct
//      Check if the is no possible answer
//      Redraw button