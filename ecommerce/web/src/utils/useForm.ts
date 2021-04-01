import { FormEvent, useState } from "react";

export const useForm = (initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChangeHandler = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return {
        values,
        onChangeHandler,
    };
};
