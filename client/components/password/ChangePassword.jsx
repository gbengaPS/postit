import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import InputField from '../common/InputField';
import SubmitButton from '../common/SubmitButton';
import Nav from '../common/Nav';
import { updatePassword } from '../../actions/passwordActions';

/**
 *
 * @class ChangePassword
 *
 * @extends { React.Component }
 */
export class ChangePassword extends React.Component {
  /**
   * @description Creates an instance of ChangePassword.
   *
   * @returns {void} -returns nothing
   */
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      error: '',
      password: '',
      confirmPassword: '',
    };
  }

  /**
   * @description form validation function
   *
   * @returns {boolean} returns boolean
   */
  validateForm() {
    if (this.state.password.length < 6) {
      this.setState({ error: 'Password cannot be less than 6 characters' });
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords did not match' });
    } else if (this.state.password.trim().length === 0) {
      this.setState({ error: 'Password cannot be all spaces' });
    } else {
      return true;
    }
  }
  /**
   * @description handles onChange event
   *
   * @param {object} event -event object
   *
   * @returns {void} -returns nothing
   */
  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }
  /**
   * @description handles form submission
   *
   * @param {object} event -event object
   *
   * @returns {void} -returns nothing
   */
  handleSubmit(event) {
    event.preventDefault();
    const search = new URLSearchParams(this.props.location.search);
    const validate = this.validateForm();
    const token = search.get('token');
    if (validate) {
      this.props.updatePassword({ password: this.state.password }, token);
    }
  }

  /**
   * @description render function
   *
   * @returns {jsx} -jsx representation of the component
   */
  render() {
    if (this.props.updatePasswordSuccess) {
      swal({
        title: 'Password',
        text: 'Password updated successfully',
        icon: 'success',
      }).then((result) => {
        if (result) {
          this.props.history.push('/login');
        }
      });
    }
    return (
      <div className="row">
        <Nav middleLink="Password Reset" />
        <div className="form-container col s10 offset-s1 m4 offset-m4">
          <p className="big center"> Password Reset</p>
          <span className="red-text center">
            &nbsp;{this.state.error || this.props.error.passwordUpdateError}
          </span>
          <form onSubmit={this.handleSubmit}>
            <InputField
              type="password"
              required="required"
              labelValue="Password"
              name="password"
              handleChange={this.handleChange}
            />
            <InputField
              type="password"
              required="required"
              labelValue="Confirm Password"
              name="confirmPassword"
              handleChange={this.handleChange}
            />
            <SubmitButton submitValue="Reset Password" />
            <p> &nbsp; </p>
          </form>
        </div>
      </div>
    );
  }
}
ChangePassword.propTypes = {
  location: PropTypes.object.isRequired,
  updatePassword: PropTypes.func.isRequired,
  error: PropTypes.object,
  updatePasswordSuccess: PropTypes.bool.isRequired,
  history: PropTypes.object,
};
/**
 * @description Maps state to props
 *
 * @param {object} state -application state
 *
 * @returns {object} -returns part of the state
 */
const mapStateToProps = (state) => ({
  updatePasswordSuccess: state.passwordReducer.passwordUpdated,
  error: state.passwordReducer,
});
/**
 * @description Maps dispatch to props
 *
 * @param {function} dispatch -dispatch function
 *
 * @returns {object} -actions to be dispatched
 */
const mapDispatchToProps = (dispatch) => ({
  updatePassword: (password, token) => {
    dispatch(updatePassword(password, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
