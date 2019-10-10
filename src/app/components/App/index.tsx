import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { MainPage, MapPage } from '../Pages'

import styles from './App.scss'

export class App extends React.Component<{}, {}> {
    public render(): React.ReactElement<{}> { 
        return (
            <Router>
                <div className={styles.App}>
                    <Route path="/" component={MainPage} exact />
                    <Route path="/map" component={MapPage} />
                </div>
            </Router>
        );
    }
}