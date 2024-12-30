"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/userContext";
import { toast } from "react-toastify";
import { LoginFormInputs } from "@/types";

const EmailField = function ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<LoginFormInputs>>["register"];
  errors: {
    email?: {
      message?: string;
    };
  };
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
        })}
        className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
        placeholder="Enter your email"
        aria-invalid={errors.email ? "true" : "false"}
      />
      {errors.email && (
        <span role="alert" className={styles.error}>
          {errors.email.message}
        </span>
      )}
    </div>
  );
};

const PasswordField = function ({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<LoginFormInputs>>["register"];
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
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        className={`${styles.input} ${
          errors.password ? styles.inputError : ""
        }`}
        placeholder="Enter your password"
        aria-invalid={errors.password ? "true" : "false"}
      />
      {errors.password && (
        <span role="alert" className={styles.error}>
          {errors.password.message}
        </span>
      )}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { setLoggedIn, setLoggedInUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const handleAuth: SubmitHandler<LoginFormInputs> = async (data) => {
    await authenticate("login", data);
  };

  const handleTempUser = async () => {
    const tempData: LoginFormInputs = {
      email: "tempuser@example.com",
      password: "temporary",
    };
    await authenticate("temp-user", tempData);
  };

  const authenticate = async (
    endpoint: "login" | "temp-user",
    credentials: LoginFormInputs
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        }
      );

      if (response.ok) {
        if (endpoint === "temp-user") {
          document.cookie = `tempUser=true; Path=/; Secure; SameSite=None;`;
          setLoggedInUser("Temp User");
        } else {
          const { username, access_token } = await response.json();
          document.cookie = `access_token=${access_token}; Path=/; Secure; SameSite=None;`;
          setLoggedInUser(username);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      router.push("/");
      setLoggedIn(true);
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Please check your email and password");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit(handleAuth)} noValidate>
          <EmailField register={register} errors={errors} />

          <PasswordField register={register} errors={errors} />

          <button
            type="submit"
            className={`${styles.button} ${styles.buttonMain}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className={styles.lineBreak} />

          <button
            type="button"
            onClick={handleTempUser}
            className={`${styles.button} ${styles.buttonSub}`}
            disabled={isSubmitting}
          >
            Temp User
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className={`${styles.button} ${styles.buttonSub}`}
            disabled={isSubmitting}
          >
            Sign Up
          </button>
          <p className={styles.footer}>
            Logging in as a temporary user will only store the data in local
            memory and will not persist after the session.
          </p>
        </form>
      </div>
    </div>
  );
}
