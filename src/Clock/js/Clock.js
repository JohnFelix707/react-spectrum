import autobind from 'autobind-decorator';
import {clamp} from '../../utils/number';
import classNames from 'classnames';
import {formatMoment, toMoment} from '../../utils/moment';
import moment from 'moment';
import React, {Component, PropTypes} from 'react';
import Textfield from '../../Textfield';
import '../style/index.styl';

@autobind
export default class Clock extends Component {
  static displayName = 'Clock';

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number
    ]),
    valueFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    displayFormat: PropTypes.string,
    quiet: PropTypes.bool,
    disabled: PropTypes.bool,
    invalid: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    valueFormat: 'HH:mm',
    displayFormat: 'HH:mm',
    quiet: false,
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
    onChange: function () {}
  };

  constructor(props) {
    super(props);

    const {value, defaultValue, valueFormat} = this.props;

    const val = toMoment(value || defaultValue || '', valueFormat);
    const isValid = val && val.isValid();

    this.state = {
      value: val,
      hourText: isValid ? val.format('HH') : '',
      minuteText: isValid ? val.format('mm') : ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const val = toMoment(nextProps.value, nextProps.valueFormat);
      const isValid = val && val.isValid();

      if (!isValid) {
        this.setState({
          hourText: this.state.hourText || '',
          minuteText: this.state.minuteText || ''
        });
      } else {
        if (!this.state.hourText || +this.state.hourText !== val.hour()) {
          this.setState({hourText: val.hour()});
        }

        if (!this.state.minuteText || +this.state.minuteText !== val.minute()) {
          this.setState({minuteText: val.minute()});
        }
      }

      this.setState({
        value: val
      });
    }
  }

  handleHourChange(value, e) {
    const {minuteText} = this.state;
    e.stopPropagation();
    this.changeTime(value, minuteText);
  }

  handleMinuteChange(value, e) {
    const {hourText} = this.state;
    e.stopPropagation();
    this.changeTime(hourText, value);
  }

  handleHourBlur(e) {
    let value = e.target.value;
    // normalize the hourText displayed in the input
    if (value.length <= 1) {
      value = `0${value}`;
    }

    this.setState({
      hourText: value
    });
  }

  handleMinuteBlur(e) {
    let value = e.target.value;
    // normalize the minuteText displayed in the input
    if (value.length <= 1) {
      value = `0${value}`;
    }

    this.setState({
      minuteText: value
    });
  }

  changeTime(hourText, minuteText) {
    const {valueFormat, onChange} = this.props;
    const {value} = this.state;

    const hours = parseInt(hourText, 10);
    const minutes = parseInt(minuteText, 10);

    let newTime = moment.isMoment(value) && value.clone();

    if (isNaN(hours) || isNaN(minutes)) {
      newTime = '';
    } else {
      if (!moment.isMoment(newTime)) {
        newTime = moment();
      }
      newTime.hour(clamp(hours, 0, 23));
      newTime.minute(clamp(minutes, 0, 59));
      newTime.second(0);
      newTime.millisecond(0);
    }
    this.setState({
      hourText,
      minuteText
    });

    if (!('value' in this.props)) {
      this.setState({
        value: newTime
      });
    }

    const validMoment = moment.isMoment(newTime);

    if (newTime !== value) {
      onChange(
        validMoment ? formatMoment(newTime, valueFormat) : newTime,
        validMoment && newTime.toDate()
      );
    }
  }

  render() {
    const {
      quiet,
      disabled,
      invalid,
      readOnly,
      required,
      className,
      ...otherProps
    } = this.props;

    const {hourText, minuteText} = this.state;

    delete otherProps.valueFormat;
    delete otherProps.displayFormat;
    delete otherProps.value;
    delete otherProps.defaultValue;

    return (
      <div
        className={
          classNames(
            'react-spectrum-Clock',
            className
          )
        }
        aria-disabled={disabled}
        aria-invalid={invalid}
        aria-readonly={readOnly}
        aria-required={required}
        {...otherProps}>
        <Textfield
          ref={el => {this.hourRef = el; }}
          className="react-spectrum-Clock-hour"
          type="number"
          value={hourText}
          placeholder="HH"
          min="0"
          max="23"
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          quiet={quiet}
          onChange={this.handleHourChange}
          onBlur={this.handleHourBlur} />
        <span className="react-spectrum-Clock-divider">:</span>
        <Textfield
          ref={el => {this.minuteRef = el; }}
          className="react-spectrum-Clock-minute"
          type="number"
          value={minuteText}
          placeholder="mm"
          min="0"
          max="59"
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          quiet={quiet}
          onChange={this.handleMinuteChange}
          onBlur={this.handleMinuteBlur} />
      </div>
    );
  }
}
