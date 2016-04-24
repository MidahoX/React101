var StarsFrame = React.createClass({
    getInitialState: function(){
        var randomNumber = Math.floor( Math.random() * 9) + 1;

        // get a random number and return it
        return({starNum: randomNumber});
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
        return (
            <div id="button-frame">
                <button className="btn btn-primary btn-lg">=</button>
            </div>
        );
    }
});

var AnswerFrame = React.createClass({
    render:function(){
        return (
            <div id="answer-frame">
                <div className="well">

                </div>
            </div>
        );
    }
});

var NumberFrame = React.createClass({
    updateParentState: function(value){
        this.props.appendNumberState(value);
    },
    render:function(){
        var numbers = [];
        var numberStateArray = this.props.selectedNumber;
        for(var i = 0; i<9 ;i++){
            var classAttrs = 'number selecte-' ($.inArray(i+1,numberStateArray) > -1) ? "true" : "false";
            numbers.push(
                <div className="{classAttrs}" onClick={updateParentState} >{i+1}</div>
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
        return ({numberState : []});
    },
    appendNumberState : function(value){
        var numberStateArray = $(this.state.numberState);

        // if the value is not in the list, add it to the list and let react re-render
        if($.inArray(value, numberStateArray) == -1)
        {
            numberStateArray.push(value);
            this.setState({numberState : numberStateArray});
        }
    }
    render:function(){
        return (
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div className="clearfix">
                    <StarsFrame />
                    <ButtonFrame />
                    <AnswerFrame selectedNumber={this.numerState}/>
                </div>
                <NumberFrame selectedNumber={this.numerState} updateState={this.appendNumberState}}/>
            </div>
        );
    }
});

React.render(
    <Game />, document.getElementById('container')
);
