var StarsFrame = React.createClass({displayName: "StarsFrame",
    getInitialState: function(){
        // return the star value from Game component
        return {starNum: this.props.numberOfStar};
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
        var disabled;
        disabled = (this.props.selectNumbers.length === 0) ? "disabled": "";
        return (
            React.createElement("div", {id: "button-frame"}, 
                React.createElement("button", {className: "btn btn-primary btn-lg", disabled: disabled}, "=")
            )
        );
    }
});

var AnswerFrame = React.createClass({displayName: "AnswerFrame",
    render:function(){
        // get the selected number from Game component and render here
        var selectNumbers = this.props.selectNumbers;
        var unselectClick = this.props.unselectNumberClick;
        var numbers = selectNumbers.map(function(i, value){
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

var NumberFrame = React.createClass({displayName: "NumberFrame",
    updateParentState: function(value){
        // this is the NumberFrame, we need to get the value of the click numbers

        var clickNumber = this.props.val;
        this.props.updateState(clickNumber);
    },
    render:function(){
        var numbers = [];
        var numberStateArray = this.props.selectNumbers;
        // get the update parent click function from props
        var clickNumFunc = this.props.updateState;

        // NOTE: clickNumFunc.bind(null,i) : create a closure and bind the value to the function.

        for(var i = 1; i<=9 ;i++){
            var classAttrs = 'number select-' + (($.inArray(i,numberStateArray) > -1) ? "true" : "false");
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
    getInitialState: function(){
        var randomNumber = Math.floor( Math.random() * 9) + 1;
        return {
                numberOfStar: randomNumber,
                numberState : []
            };
    },
    selectNumber : function(value){
        var numberStateArray = $(this.state.numberState);

        // if the value is not in the list, add it to the list and let react re-render
        if($.inArray(value, numberStateArray) == -1)
        {
            numberStateArray.push(value);
            this.setState({numberState : numberStateArray});
        }
    },
    unselectNumber : function(value){
        //  var valueIndex = this.state.numberState.index(value);
        // remove the value from the selected number state array
        this.setState(
            {
                numberState: this.state.numberState.slice(value,1)
            }
        );
    },
    render:function(){
        var selectedNumbers = this.state.numberState;

        return (
            React.createElement("div", {id: "game"}, 
                React.createElement("h2", null, "Play Nine"), 
                React.createElement("hr", null), 
                React.createElement("div", {className: "clearfix"}, 
                    React.createElement(StarsFrame, {numberOfStar: this.state.numberOfStar}), 
                    React.createElement(ButtonFrame, {selectNumbers: this.state.numberState}), 
                    React.createElement(AnswerFrame, {selectNumbers: this.state.numberState, unselectNumberClick: this.unselectNumber})
                ), 
                React.createElement(NumberFrame, {selectNumbers: this.state.numberState, updateState: this.selectNumber})
            )
        );
    }
});

React.render(
    React.createElement(Game, null), document.getElementById('container')
);