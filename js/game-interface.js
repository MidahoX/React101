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
    getInitialState: function(){
        // return the star value from Game component
        return {starNum: this.props.numberOfStars};
    },
    render:function(){
        var numberOfStars = this.state.starNum;
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
        if(disabled == "")
        {
            if(status != null )
            {
                className += (status ?" btn-correct":" btn-incorrect");
            }
        }
        return (
            React.createElement("div", {id: "button-frame"}, 
                React.createElement("button", {className: className, disabled: disabled, onClick: checkResultClick}, "=")
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
            classAttrs += (usedNumbers.indexOf(i) > -1 ? " number-used": "");

            numbers.push(
                React.createElement("div", {className: classAttrs, onClick: clickNumFunc.bind(null,i)}, i)
            );
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

var Game = React.createClass({displayName: "Game",
    getRandomValue: function (){
        return Math.floor( Math.random() * 9) + 1;
    },
    getInitialState: function(){
        return {
                numberOfStars: this.getRandomValue(),
                selectedNumbers : [],
                usedNumbers : [],
                correct: null
            };
    },
    redraw: function(){
        this.replaceState({

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
                React.createElement("div", {className: "clearfix"}, 
                    React.createElement(StarsFrame, {numberOfStars: this.state.numberOfStars}), 
                    React.createElement(ButtonFrame, {selectNumbers: this.state.selectedNumbers, status: this.state.correct, checkResultClick: this.checkResult}), 
                    React.createElement(AnswerFrame, {selectNumbers: this.state.selectedNumbers, unSelectNumberClick: this.unSelectNumber})
                ), 
                React.createElement(NumberFrame, {selectNumbers: this.state.selectedNumbers, usedNumbers: this.state.usedNumbers, selectNumberClick: this.selectNumber})
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