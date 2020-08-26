import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { LinksPages } from './pages/LinksPages'
import { CreatePage } from './pages/CreatePage'
import { DetailPage } from './pages/DetailPage'
import { AuthPage } from './pages/AuthPage'

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated){
return(
    <Switch>
        <Route    path='/links'      component={LinksPages} exact/>
        <Route    path='/create'     component={CreatePage} exact/>
        <Route    path='/detail/:id' component={DetailPage} exact/>
        <Redirect to='/create'/>
    </Switch>
)
    }

    return(
        <Switch>
            <Route    path='/' component={AuthPage} exact/>
            <Redirect to='/'/>
        </Switch>
    )
}