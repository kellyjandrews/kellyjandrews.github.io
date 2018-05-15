import React from 'react';

const Demographics = ({address, city, state, zipCode, email, phone}) => (
  <section id="demographics">
    <h2>Demographics</h2>
    <header>Address</header>
    <address>{address}<br />{city}, {state} {zipCode}</address>
    <header>Email</header>
    {email}
    <header>Phone</header>
    {phone.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
  </section>
);

export default Demographics;
