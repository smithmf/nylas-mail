import React from 'react';
import {isValidHost} from './onboarding-helpers';
import CreatePageForForm from './decorators/create-page-for-form';
import FormField from './form-field';

class AccountIMAPSettingsForm extends React.Component {
  static displayName = 'AccountIMAPSettingsForm';

  static propTypes = {
    accountInfo: React.PropTypes.object,
    errorFieldNames: React.PropTypes.array,
    submitting: React.PropTypes.bool,
    onConnect: React.PropTypes.func,
    onFieldChange: React.PropTypes.func,
    onFieldKeyPress: React.PropTypes.func,
  };

  static submitLabel = () => {
    return 'Connect Account';
  }

  static titleLabel = () => {
    return 'Set up your account';
  }

  static subtitleLabel = () => {
    return 'Complete the IMAP and SMTP settings below to connect your account.';
  }

  static validateAccountInfo = (accountInfo) => {
    let errorMessage = null;
    const errorFieldNames = [];

    for (const type of ['imap', 'smtp']) {
      if (!accountInfo[`${type}_host`] || !accountInfo[`${type}_username`] || !accountInfo[`${type}_password`]) {
        return {errorMessage, errorFieldNames, populated: false};
      }
      if (!isValidHost(accountInfo[`${type}_host`])) {
        errorMessage = "Please provide a valid hostname or IP adddress.";
        errorFieldNames.push(`${type}_host`);
      }
      if (!Number.isInteger(accountInfo[`${type}_port`] / 1)) {
        errorMessage = "Please provide a valid port number.";
        errorFieldNames.push(`${type}_port`);
      }
    }

    return {errorMessage, errorFieldNames, populated: true};
  }

  submit() {
    this.props.onConnect();
  }

  renderPortDropdown(protocol) {
    if (!["imap", "smtp"].includes(protocol)) {
      throw new Error(`Can't render port dropdown for protocol '${protocol}'`);
    }
    const {accountInfo, submitting, onFieldKeyPress, onFieldChange} = this.props;

    if (protocol === "imap") {
      return (
        <span>
          <label htmlFor="imap_port">Port:</label>
          <select
            id="imap_port"
            tabIndex={0}
            value={accountInfo.imap_port}
            disabled={submitting}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          >
            <option value="143" key="143">143</option>
            <option value="993" key="993">993</option>
          </select>
        </span>
      )
    }
    if (protocol === "smtp") {
      return (
        <span>
          <label htmlFor="smtp_port">Port:</label>
          <select
            id="smtp_port"
            tabIndex={0}
            value={accountInfo.smtp_port}
            disabled={submitting}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          >
            <option value="25" key="25">25</option>
            <option value="465" key="465">465</option>
            <option value="587" key="587">587</option>
          </select>
        </span>
      )
    }
    return "";
  }

  renderSecurityDropdown(protocol) {
    const {accountInfo, submitting, onFieldKeyPress, onFieldChange} = this.props;

    return (
      <div>
        <span>
          <label htmlFor={`${protocol}_security`}>Security:</label>
          <select
            id={`${protocol}_security`}
            tabIndex={0}
            value={accountInfo[`${protocol}_security`]}
            disabled={submitting}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          >
            <option value="SSL / TLS" key="SSL">SSL / TLS</option>
            <option value="STARTTLS" key="STARTTLS">STARTTLS</option>
            <option value="none" key="none">none</option>
          </select>
        </span>
        <span style={{paddingLeft: '20px', paddingTop: '10px'}}>
          <input
            type="checkbox"
            id={`${protocol}_allow_insecure_ssl`}
            disabled={submitting}
            checked={accountInfo[`${protocol}_allow_insecure_ssl`] || false}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          />
          <label htmlFor={`${protocol}_allow_insecure_ssl"`} className="checkbox">Allow insecure SSL</label>
        </span>
      </div>
    )
  }

  renderFieldsForType(type) {
    return (
      <div>
        <FormField field={`${type}_host`} title={"Server"} {...this.props} />
        <div style={{textAlign: 'left'}}>
          {this.renderPortDropdown(type)}
          {this.renderSecurityDropdown(type)}
        </div>
        <FormField field={`${type}_username`} title={"Username"} {...this.props} />
        <FormField field={`${type}_password`} title={"Password"} type="password" {...this.props} />
      </div>
    );
  }

  render() {
    return (
      <div className="twocol">
        <div className="col">
          <div className="col-heading">Incoming Mail (IMAP):</div>
          {this.renderFieldsForType('imap')}
        </div>
        <div className="col">
          <div className="col-heading">Outgoing Mail (SMTP):</div>
          {this.renderFieldsForType('smtp')}
        </div>
      </div>
    )
  }
}

export default CreatePageForForm(AccountIMAPSettingsForm);
