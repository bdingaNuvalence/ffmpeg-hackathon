import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.scss';
import AssetMaster from './sections/AssetMaster';
import About from './sections/About';
import Movie from './sections/Movie';
// import Organization from './sections/Organization';
import Organization from './sections/Organization/index.final.jsx';
import Home from './sections/Home';
import Header from './components/Header';
import Footer from './components/Footer';

const Page404 = () => <>
  <Header />
  <main className="main-content main-about 404-page">
    <section className="main-content-wrap movie">
      <h2 className="heading heading-content">Page Not Found!</h2>
    </section>
  </main>
  <Footer />
</>;

function App() {
  return (<>
    <Router>
      <Switch>
        <Route path="/organizations" component={Organization} />
        <Route path="/movie" component={Movie} />
        <Route exact path="/about" component={About} />
        <Route exact path="/assets" component={AssetMaster} />
        <Route exact path="/" component={Home} />
        <Route render={Page404}/>
      </Switch>
    </Router>
  </>);
}

export default App;
