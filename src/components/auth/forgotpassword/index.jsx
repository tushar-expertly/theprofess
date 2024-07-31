import React, { useState } from "react";
import Layout from "../../layout";
import FormAction from "../FormAction";
import Header from "../Header";
import { ForgotPasswordFields } from "../formFields";
import Input from "../Input";
import { useNavigate } from "react-router-dom";

const fields = ForgotPasswordFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));
function ForgotPassword() {
  const [forgotPasswordFieldsState, setForgotPasswordFieldsState] =
    useState(fieldsState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForgotPasswordFieldsState({
      ...forgotPasswordFieldsState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.goexpertly.com/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotPasswordFieldsState.email,
            oldPassword: forgotPasswordFieldsState.oldPassword,
            newPassword: forgotPasswordFieldsState.newPassword,
          }),
        }
      );
      if (response.ok) {
        navigate("/login");
        // Password reset successful
        // Redirect or show a success message
      } else {
        // Handle error response from the API
        // Display error message or handle accordingly
      }
    } catch (error) {
      // Handle network errors or other exceptions
    }
  };
  return (
    <Layout>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Header
            heading="FORGOT PASSWORD"
            paragraph="Already have an account? "
            linkName="Back to Login"
            linkUrl="/login"
          />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="">
              {fields.map((field) => (
                <Input
                  key={field.id}
                  handleChange={handleChange}
                  value={forgotPasswordFieldsState[field.id]}
                  labelText={field.labelText}
                  labelFor={field.labelFor}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  isRequired={field.isRequired}
                  placeholder={field.placeholder}
                />
              ))}
              <FormAction handleSubmit={handleSubmit} text="Change" />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
