var StarsFrame = React.createClass({
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

var NumberFrame = React.createClass({
    updateParentState: function(value){
        // this is the NumberFrame, we need to get the value of the click numbers

        var clickNumber = this.props.val;
        this.props.selectNumberClick(clickNumber);
    },
    render:function(){
        var numbers = [];
        var selectedNumbersArray = this.props.selectNumbers;
        // get the update parent click function from props
        var clickNumFunc = this.props.selectNumberClick;

        // NOTE: clickNumFunc.bind(null,i) : create a closure and bind the value to the function.

        for(var i = 1; i<=9 ;i++){
            var classAttrs = 'number select-' + ((selectedNumbersArray.indexOf(i) > -1) ? "true" : "false");
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
    getRandomValue: function (){
        return Math.floor( Math.random() * 9) + 1;
    },
    getInitialState: function(){
        var randomNumber = this.getRandomValue();
        return {
                numberOfStars: randomNumber,
                selectedNumbers : []
            };
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

        if(value > -1)
        {
            // remove the value from the selected number state array
            this.setState(
                {selectedNumbers: selectedNumbers.splice(valueIndex,1)}
            );
        }
    },
    render:function(){
        return (
            <div id="game">
                <h2>Play Nine</h2>
                <hr/>
                <div className="clearfix">
                    <StarsFrame numberOfStars={this.state.numberOfStars} />
                    <ButtonFrame selectNumbers={this.state.selectedNumbers} />
                    <AnswerFrame selectNumbers={this.state.selectedNumbers} unSelectNumberClick={this.unSelectNumber} />
                </div>
                <NumberFrame selectNumbers={this.state.selectedNumbers} selectNumberClick={this.selectNumber} />
            </div>
        );
    }
});

React.render(
    <Game />, document.getElementById('container')
);
