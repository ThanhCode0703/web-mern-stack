import { Input } from "antd";
import "./InputForm.css";

function InputForm(props) {
  const { placeholder, ...rests } = props;
  return (
    <div className="input-form-wrapper">
      <Input
        className="input-sign-in-form"
        autoComplete="new-password"
        placeholder={placeholder}
        valueinput={props.value}
        {...rests}
        onChange={props.onChange}
      />
    </div>
  );
}

export default InputForm;
