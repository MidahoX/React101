var Card = React.createClass({displayName: "Card",
    getInitialState: function(){
        return {};
    },
    componentDidMount: function(){
        var component = this;
        $.get("https://api.github.com/users/" + this.props.login, function(data){
            component.setState(data);
        })
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("img", {src: this.state.avatar_url, width: "80"}), 
                React.createElement("h3", null, this.state.name), 
                React.createElement("hr", null)
            )
        );
    }
});

var Form = React.createClass({displayName: "Form",
    handleSubmit : function(e){
        e.preventDefault();
        // find the dom element and get the login value
        var loginInput = ReactDOM.findDOMNode(this.refs.login);
        this.props.addCard(loginInput.value);
        loginInput.value =  ' ';
    },
    render: function(){
        return (
            React.createElement("form", {onSubmit: this.handleSubmit}, 
                React.createElement("input", {placeholder: "github login", ref: "login"}), 
                React.createElement("button", null, "Add")
            )
        );
    }
});


var Main = React.createClass({displayName: "Main",
    getInitialState: function(){
        var loginArray = [];
        return {logins: loginArray};
    },
    addCard : function(loginId){
        var loginArray = $(this.state.logins);
        loginArray.push(loginId);
        this.setState({logins: loginArray });
    },
    render: function(){
        var cards = $(this.state.logins).map(function(login){
            return (React.createElement(Card, {login: login}));
        });
        return (
            React.createElement("div", null, 
                React.createElement(Form, {addCard: this.addCard}), 
                cards
            )
        )
    }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById("root"));