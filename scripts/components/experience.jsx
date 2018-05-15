import React, {Component} from 'react';
import moment from 'moment';

function Experience({employers}) {
  return(
    <section id="experience">
      <h2>Experience</h2>
      {employers.map((item, index) => <Twisty {...item} key={item.employer.replace(/\s/g, '').toLowerCase()} />)}
    </section>
  );
}

class Twisty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    let {employer, startDate, endDate, roles} = this.props;
    return(
      <section onClick={this.handleClick.bind(this)} className={this.state.isOpen ? 'active' : null} >
        <header>{employer}<small>{dateFormat(startDate)} - {dateFormat(endDate)}</small></header>
        {roles.map((item, index) => role(item, index))}
      </section>
    );
  }
}

const dateFormat = (date) => moment(new Date(date)).format('MM-DD-YYYY');


function role({title, description, skills}, index) {
  return (
    <article key={index}>
      <header>{title}</header>
      <main>{description}</main>
      <footer>{skills.map((item,index) => <span className='tag'>{item}</span>)}</footer>
    </article>
  )
}
export default Experience;
