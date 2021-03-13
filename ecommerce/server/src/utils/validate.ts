import { RegisterInputs } from "../resolvers/inputs/registerInputs";

export const validateRegister = (userInputs: RegisterInputs) => {
    if (!userInputs.email.includes("@")) {
        return [
            {
                field: "email",
                message: "Invalid email",
            },
        ];
    }
    if (userInputs.username.length <= 2) {
        return [
            {
                field: "username",
                message: "username must be at least 2 character",
            },
        ];
    }
    if (userInputs.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Cannot include @ sign",
            },
        ];
    }

    if (userInputs.password.length <= 3) {
        return [
            {
                field: "password",
                message: "password must be at least 3 character",
            },
        ];
    }

    return null;
};
