import React from "react";
import { useProductsQuery } from "../generated/graphql";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const { data } = useProductsQuery();

    console.log(data);

    return <div className='text-8xl'>Register Page</div>;
};

export default Register;
