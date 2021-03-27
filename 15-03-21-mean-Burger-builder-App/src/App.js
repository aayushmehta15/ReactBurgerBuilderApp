import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
// import Checkout from "./containers/Checkout/Checkout";
// import Orders from "./containers/Orders/Orders";
// import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
    return import("./containers/Checkout/Checkout");
});

const asyncOrders = asyncComponent(() => {
    return import("./containers/Orders/Orders");
});

const asyncAuth = asyncComponent(() => {
    return import("./containers/Auth/Auth");
});

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignup();
    }
    render() {
        let routes = (
            // Routes for unauthenticated Users
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
                {/*if a user try to visit some other page like orders he cant he'll redirect
                to "/" since orders page is for only Authenticated users*/}
            </Switch>
        );

        if (this.props.inAuthenticated) {
            routes = (
                // Routes for authenticated Users
                <Switch>
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            );
        }
        return (
            <div>
                <Layout>{routes}</Layout>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        inAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
