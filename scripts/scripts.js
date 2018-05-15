
import React, { Component } from 'react';
import {render} from 'react-dom';

import Demographics from './components/demographics.jsx';
import Education from './components/education.jsx';
import Experience from './components/experience.jsx';
import Skills from './components/skills.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="experience">
        <aside>
          <Demographics {...this.props.demographics}/>
          <Education {...this.props.education}/>
          <Skills {...this.props.skills}/>
        </aside>
        <main>
          <Experience {...this.props.experience} />
        </main>
      </div>
    )
  }
}

render(<App {...window.data} />, document.getElementById('experienceWrapper'));

// hbs.registerHelper('formatDate', function(date, pattern) {
// 	date = new Date(date);
// 	return new hbs.SafeString(moment(date).format("MM-DD-YYYY"));
// });
