import React from 'react';
import './css.scss';

const isEmailValid = (email) => {
  const atpos = email.indexOf('@');
  const dotpos = email.lastIndexOf('.');
  if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
    return false;
  }
  return true;
};
const isValidContactForm = ({ fullnameField: fullname, emailField: email }) => {
  const errors = [];

  if (typeof fullname !== 'string' || fullname.trim().length === 0 || !fullname.trim().includes(' ')) {
    errors.push({ field: 'fullname', message: 'Invalid Name! Must have a space & not empty' });
  }

  if (!isEmailValid(email)) {
    errors.push({ field: 'email', message: 'Invalid Email! Must have an at-symbol (\'@\') followed by a domain with a TLD' });
  }

  return errors;
};
const ContactForm = ({ onSubmit, isSent = false }) => {
  const handler = (event) => {
    const parseForm = Array.from(new FormData(event.target).entries())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    const errors = isValidContactForm(parseForm);

    if (errors.length === 0) {
      const { fullnameField: fullname, emailField: email } = parseForm;
      onSubmit({ email, fullname });
    } else {
      alert(errors[0].message);
    }

    // block the native event
    event.preventDefault();
    return false;
  };

  return <div className="contact-form-wrapper">
    <hr />
    { isSent && <div className="contact-sent-blocker"><h5 className="heading heading-sub-content">Message Sent</h5></div>}
    <form onSubmit={handler}>
    <h5 className="heading heading-sub-content">Make a contact request</h5>
    <fieldset>
      <legend>Contact Details</legend>
      <label htmlFor="contactFullnameField" className="body-text">
        Fullname
        <input type="text" placeholder="Your Fullname" id="contactFullnameField" name="fullnameField" />
      </label>

      <label htmlFor="contactEmailField" className="body-text">
        Reply Email
        <input type="text" placeholder="example@gmail.com" id="contactEmailField" name="emailField" />
      </label>
    </fieldset>
    <input type="submit" value="Send" />
  </form>
  </div>;
};

export default ContactForm;
