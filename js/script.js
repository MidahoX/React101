var Button = React.createClass({displayName: "Button",
    localHandleClick: function(){
        this.props.localHandleClick(this.props.increment);
    },
    render: function()
    {
        return(
            React.createElement("button", {onClick: this.localHandleClick}, "+", this.props.increment)
        )
    }
});

var Result = React.createClass({displayName: "Result",
    render: function(){
        return (
            React.createElement("div", null, this.props.localCounter)
        )
    }
});

var Main = React.createClass({displayName: "Main",
    getInitialState:function(){
        return {counter: 0};
    },
    handleClick: function(increment){
        this.setState({ counter: this.state.counter + increment });
    },
    render: function(){
        return (
            React.createElement("div", null, 
                React.createElement(Button, {localHandleClick: this.handleClick, increment: 1}), 
                React.createElement(Button, {localHandleClick: this.handleClick, increment: 5}), 
                React.createElement(Button, {localHandleClick: this.handleClick, increment: 10}), 
                React.createElement(Button, {localHandleClick: this.handleClick, increment: 100}), 
                React.createElement(Result, {localCounter: this.state.counter})
            )
        )
    }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById("root"));