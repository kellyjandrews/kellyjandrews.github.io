import React from 'react';
import moment from 'moment';

const Education = ({school, degree, major, minor, graduationDate}) => (
  <section id="education">
    <h2>Education</h2>
    <header>School</header>
    {school}
    <header>Degree</header>
    {degree}
    <header>Major - Minor</header>
    {major} - {minor}
    <header>Graduation Date</header>
    {moment(new Date(graduationDate)).format("MM-DD-YYYY")}
  </section>
);

export default Education;
