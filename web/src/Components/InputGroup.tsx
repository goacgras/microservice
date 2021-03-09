import React from 'react';
import classNames from 'classnames';

interface InputGroupProps {
    classname?: string;
    type: string;
    placeholder: string;
    value: string;
    error?: string | undefined;
    setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
    classname,
    type,
    placeholder,
    value,
    error,
    setValue
}) => {
    return (
        <div className={classname}>
            <input
                type={type}
                className={classNames(
                    'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ',
                    { 'border-red-500': error }
                )}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            />
            <small className="font-medium text-red-600">{error}</small>
        </div>
    );
};

export default InputGroup;
