import React from 'react';

const Skills = ({languages, frameworks, general, certificates}) => (
  <section id="skills">
    <h2>Skills</h2>
    <header>Languages</header>
    {languages.map((item, index) => <span className='tag'>{item}</span>)}

    <header>Frameworks</header>
    {frameworks.map((item, index) => <span className='tag'>{item}</span>)}

    <header>General</header>
    {general.map((item, index) => <span className='tag'>{item}</span>)}

    <header>Certificates</header>
    {certificates.map((item, index) => <span className='tag'>{item}</span>)}
  </section>
);

export default Skills;
