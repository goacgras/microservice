import { UserAccount } from "../resolvers/outputs/UserAccount";
import fetch from "node-fetch";

export const checkAccount = async (
    accountName: string
): Promise<UserAccount> => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/auth/checkAccount/${accountName}`
        );
        const data: UserAccount = await response.json();

        return data;
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
};
