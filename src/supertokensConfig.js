import React from 'react';

import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import Passwordless from "supertokens-auth-react/recipe/passwordless";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {
        appName: "RememberWhen",
        apiDomain: "http://localhost:3000/",
        websiteDomain: "http://localhost:3000/",
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
    },
    recipeList: [
        Passwordless.init({
            contactMethod: "EMAIL"
        }),
        Session.init()
    ]
});


/* Your App */
class App extends React.Component {
    render() {
        return (
            <SuperTokensWrapper>
                {/*Your app components*/}
            </SuperTokensWrapper>
        );
    }
}