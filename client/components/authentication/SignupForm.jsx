import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Proptypes from 'prop-types';
import Nav from '../common/Nav';
import InputField from '../common/InputField';
import SubmitButton from '../common/SubmitButton';

/**
 * @description SignupForm component
 *
 * @param {object} props -prop object
 *
 * @returns {jsx} -jsx representation of the component
 */
const SignupForm = (props) => {
  let submitValue = '';
  let disabled;
  if (props.loading) {
    submitValue = 'Signing up...';
    disabled = 'disabled';
  } else {
    submitValue = 'Signup';
    disabled = '';
  }
  return (
    <div className="row">
      <Nav />
      <div className="col s12 m4 offset-m4">
        <div className="form-container">
          <p className="center grey-text big">Signup</p>
          <p className="red-text">&nbsp; {props.error}</p>
          <form method="POST" action="#" onSubmit={props.handleSubmit}>
            <InputField
              required="required"
              type="text"
              name="fullName"
              labelValue="Full name"
              handleChange={props.handleChange}
              classnames={classnames('', { invalid: props.errors.fullName })}
            />
            <span className="red-text" id="fullname-error">
              &nbsp;{props.errors.fullName}
            </span>
            <InputField
              required="required"
              type="text"
              name="username"
              labelValue="Username"
              handleChange={props.handleChange}
              classnames={classnames('', { invalid: props.errors.username })}
            />
            <span className="red-text" id="username-error">
              &nbsp;{props.errors.username}
            </span>
            <InputField
              required="required"
              type="email"
              name="email"
              labelValue="Email"
              handleChange={props.handleChange}
              classnames={classnames('', { invalid: props.errors.email })}
            />
            <span className="red-text" id="email-error">
              &nbsp;{props.errors.email}
            </span>
            <InputField
              required="required"
              type="text"
              name="phoneNumber"
              labelValue="Phone Number"
              handleChange={props.handleChange}
              errorClass="valid"
              classnames={classnames('', { invalid: props.errors.phoneNumber })}
            />
            <span className="red-text" id="phoneNumber-error">
              &nbsp;{props.errors.phoneNumber}
            </span>
            <InputField
              required="required"
              type="password"
              name="password"
              labelValue="Password"
              handleChange={props.handleChange}
              errorClass="valid"
              classnames={classnames('', { invalid: props.errors.phoneNumber })}
            />
            <span className="red-text" id="password-error">
              &nbsp;{props.errors.password}
            </span>
            <SubmitButton submitValue={submitValue} disabled={disabled} />
            <p className="center">
              {' '}
              Already have and acount?
              <Link to="login" id="login">
                {' '}
                Login{' '}
              </Link>
            </p>
            <p />
          </form>
        </div>
      </div>
    </div>
  );
};
SignupForm.propTypes = {
  errors: Proptypes.object,
  handleChange: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func.isRequired,
  error: Proptypes.string,
  loading: Proptypes.bool,
};
export default SignupForm;
