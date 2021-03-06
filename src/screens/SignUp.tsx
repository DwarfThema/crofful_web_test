import styled from "styled-components";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import routes from "../routes";
import { useNavigate } from "react-router-dom";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from "../generated/graphql";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

interface IForm {
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  hasError?: string;
  result?: string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $userName: String!
    $lastName: String
    $firstName: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      userName: $userName
      lastName: $lastName
      firstName: $firstName
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<IForm>({ mode: "onChange" });

  const navigate = useNavigate();

  const onCompleted = (data: any) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", { message: error });
    }
    const { userName, password } = getValues();
    navigate(routes.home, {
      state: {
        message: "????????? ??????????????????. ????????? ????????????.",
        userName,
        password,
      },
      replace: true,
    });
  };

  const [createAccount, { loading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = (data: any) => {
    if (loading) {
      return;
    }
    const { userName, firstName, lastName, email, password } = data;
    createAccount({
      variables: {
        userName,
        firstName,
        lastName,
        email,
        password,
      },
    });
  };

  return (
    <AuthLayout>
      <PageTitle title="????????????" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>???????????? ????????? ???????????? ????????? ???????????????.</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("userName", {
              required: "???????????? ????????? ?????????.",
            })}
            type="text"
            placeholder="?????????"
            hasError={Boolean(errors?.userName?.message)}
          />
          <Input
            {...register("lastName", {})}
            type="text"
            placeholder="???"
            hasError={Boolean(errors?.lastName?.message)}
          />
          <Input
            {...register("firstName", {
              required: "????????? ????????? ?????????.",
            })}
            type="text"
            placeholder="??????"
            hasError={Boolean(errors?.firstName?.message)}
          />
          <Input
            {...register("email", {
              required: "???????????? ????????? ?????????.",
            })}
            type="text"
            placeholder="?????????"
            hasError={Boolean(errors?.email?.message)}
          />
          <Input
            {...register("password", {
              required: "??????????????? ????????? ?????????.",
            })}
            type="text"
            placeholder="????????????"
            hasError={Boolean(errors?.password?.message)}
          />
          <Button
            type="submit"
            value={loading ? "??????????????????." : "??????"}
            disabled={!isValid || loading || !isDirty}
          />
        </form>
      </FormBox>
      <BottomBox
        cta="???????????? ????????????????"
        link={routes.home}
        linkText="????????? ??????"
      />
    </AuthLayout>
  );
};

export default SignUp;
