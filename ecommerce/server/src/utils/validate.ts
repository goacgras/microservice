// import { Product } from "../entities/Product";
import { Product } from "../entities/Product";
import { OrderInput, RegisterInputs } from "../resolvers/inputs/registerInputs";

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

export const validateOrder = async (orders: OrderInput[]) => {
    let errors: any = [];

    await Promise.all(
        orders.map(async (o) => {
            let err: any = {};
            const prod = await Product.findOne({ where: { name: o.name } });
            if (!prod) {
                err = {
                    field: o.name,
                    message: "product not exist",
                };
                errors.push(err);
            } else if (prod.quantity <= 0 || prod.quantity - o.quantity < 0) {
                err = {
                    field: o.name,
                    message: "insufficient quantity",
                };
                errors.push(err);
            }
        })
    );

    return errors;
};
