import React, { useState, useEffect } from "react";
import isEmpty from "../helpers/isEmpty";
import { SelectChangeEvent } from "@mui/material";
import { cleanPhoneValue } from "../helpers/numberFormat";

const useForm = <T, E>(
  callback: () => void,
  validate: (values: T) => E,
  convert?: (name: string, value: any) => any
) => {
  const [values, setValues] = useState<T>({} as T);
  const [errors, setErrors] = useState<E>({} as E);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEmpty(errors) && isSubmitting) {
      callback();
      setIsSubmitting(false);
    }
  }, [errors]);

  const handleSubmit = () => {
    setErrors(validate(values));
    setIsSubmitting(true);
  };
  const handleChangeSelect = (event: SelectChangeEvent<unknown>): void => handleGenericChange(event.target.name as string, event.target.value);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    if (event?.persist != null) event.persist();

    handleGenericChange(event.target.name as string, event.target.value)
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    handleGenericChange(event.target.name as string, event.target.checked)
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleGenericChange(event?.target.name as string, cleanPhoneValue(event.target.value))
  };

  const handleGenericChange = (name: string, value: any) => {
    const v = convert
      ? convert(name, value)
      : value;
    const vals = {
      ...values,
      [name]: v,
    };
    setValues(vals);
    if (
      v != null &&
      (values as any)[name] !== v
    ) {
      setErrors(validate(vals));
    }
  }

  return {
    handleGenericChange,
    handleChange,
    handleCheckChange,
    handleChangeSelect,
    handlePhoneChange,
    handleSubmit,
    values,
    errors,
    setValues,
    setErrors,
  };
};

export default useForm;
