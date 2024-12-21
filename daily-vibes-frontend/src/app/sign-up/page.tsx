"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./sign-up.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React from "react";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const EmailField = function ({
  register,
  errors,
  checkEmailDuplication,
}: {
  register: ReturnType<typeof useForm<SignUpFormInputs>>["register"];
  errors: {
    email?: {
      message?: string;
    };
  };
  checkEmailDuplication: (value: string) => Promise<true | string>;
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor="email" className={styles.label}>
        Email
      </label>
      <input
        type="email"
        id="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            message: "Invalid email address",
          },
          validate: async (value) => await checkEmailDuplication(value),
        })}
        className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
        placeholder="Enter your email"
        aria-invalid={errors.email ? "true" : "false"}
      />
      {errors.email && (
        <p role="alert" className={styles.error}>
          {errors.email.message}
        </p>
      )}
    </div>
  );
};

const PasswordField = function ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<SignUpFormInputs>>["register"];
  errors: {
    password?: {
      message?: string;
    };
  };
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <input
        type="password"
        id="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        })}
        className={`${styles.input} ${
          errors.password ? styles.inputError : ""
        }`}
        placeholder="Create a password"
        aria-invalid={errors.password ? "true" : "false"}
      />
      {errors.password && (
        <p role="alert" className={styles.error}>
          {errors.password.message}
        </p>
      )}
    </div>
  );
};

const ConfirmPasswordField = function ({
  register,
  watchPassword,
  errors,
}: {
  register: ReturnType<typeof useForm<SignUpFormInputs>>["register"];
  watchPassword: string;
  errors: {
    confirmPassword?: {
      message?: string;
    };
  };
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor="confirmPassword" className={styles.label}>
        Confirm Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === watchPassword || "Passwords do not match",
        })}
        className={`${styles.input} ${
          errors.confirmPassword ? styles.inputError : ""
        }`}
        placeholder="Confirm your password"
        aria-invalid={errors.confirmPassword ? "true" : "false"}
      />
      {errors.confirmPassword && (
        <p role="alert" className={styles.error}>
          {errors.confirmPassword.message}
        </p>
      )}
    </div>
  );
};

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    mode: "onBlur",
  });

  const watchPassword = watch("password", "");

  const checkEmailDuplication = async (email: string) => {
    if (!email) return true;
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/user/findUser?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.email) {
          return "Email already exists!";
        } else {
          return true;
        }
      } else {
        return "Failed to verify email.";
      }
    } catch (error) {
      toast.error(`Failed to verify email.${error}`);
      return "Failed to verify email.";
    }
  };

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Sign up successful!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          <EmailField
            register={register}
            errors={errors}
            checkEmailDuplication={checkEmailDuplication}
          />
          <PasswordField register={register} errors={errors} />
          <ConfirmPasswordField
            register={register}
            watchPassword={watchPassword}
            errors={errors}
          />

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/login" className={styles.link}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
