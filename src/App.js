import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { isUserLoggedIn } from "./utils/session";
import HomeView from "./components/home/HomeView";
import EventView from "./components/event/EventView";
import LoginView from "./components/login/LoginView";
import SettingsView from "./components/settings/SettingsView";
import VerifyView from "./components/login/VerifyView";
import AdminView from './components/admin/AdminView';
import ApproveView from './components/event/ApproveView';
import { AuthProvider, RequireAuth } from "./auth/authProvider";
import { OidcResponseHandler } from "./auth/auth";
import { ChakraProvider } from '@chakra-ui/react';
// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: {
      100: "#FFFFFF",
      500: "#5F63D4",
      900: "#474BCC"
    },
  },
})

const App = () => {
    return (
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <div>
              <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=yes" />
                <meta name="theme-color" content="#5f63d4" />
                <link href="https://fonts.googleapis.com/css?family=Fredoka+One|Nunito:300,400,600,700" rel="stylesheet" />
                <title>DormDigest</title>
              </Helmet>
              <Routes>
                <Route exact path="/" element={
                  <RequireAuth>
                    <HomeView />
                  </RequireAuth>
                } />
                {/* <Route path="/login" element={<LoginPage />} /> */}
                <Route path="/oidc-response" element={<OidcResponseHandler />} />
                <Route exact path="/event/:id" element={<EventView />} />
                <Route exact path="/approve/:id" element={<ApproveView />} />
                <Route exact path="/login" element={<LoginView />} />
                <Route exact path="/settings" element={<SettingsView />} authenticated={true} />
                <Route exact path="/admin" element={<AdminView />} authenticated={true} />
                <Route exact path="/verify" element={<VerifyView />} />
              </Routes>
            </div>
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>
    );
  }


// const DormspamRoute = ({ component: Component, ...rest }) => {
//   if (rest.authenticated === true && !isUserLoggedIn()) {
//     return <LoginView />;
//   } else {
//     return <Route
//       {...rest}
//       render={props =>
//         <Component {...props} />
//       }
//     />;
//   }
// };

export default App;
