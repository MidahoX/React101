var StarsFrame = React.createClass({
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
        var disabled;
        disabled = (this.props.selectNumbers.length === 0) ? "disabled": "";
        return (
            <div id="button-frame">
                <button className="btn btn-primary btn-lg" disabled={disabled} >=</button>
            </div>
        );
    }
});

var AnswerFrame = React.createClass({
    render:function(){
        // get the selected number from Game component and render here
        var selectNumbers = this.props.selectNumbers;
        var unselectClick = this.props.unselectNumberClick;
        var numbers = selectNumbers.map(function(i, value){
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

var NumberFrame = React.createClass({
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
                <div className={classAttrs} onClick={clickNumFunc.bind(null,i)} >{i}</div>
            );
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

var Game = React.createClass({
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
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div className="clearfix">
                    <StarsFrame numberOfStar={this.state.numberOfStar} />
                    <ButtonFrame selectNumbers={this.state.numberState} />
                    <AnswerFrame selectNumbers={this.state.numberState} unselectNumberClick={this.unselectNumber}/>
                </div>
                <NumberFrame selectNumbers={this.state.numberState} updateState={this.selectNumber} />
            </div>
        );
    }
});

React.render(
    <Game />, document.getElementById('container')
);
