"use client";
import React, { useState } from "react";
import { Button, Input, Notification, useToaster } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const toaster = useToaster();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      setInputError(true);
      toaster.push(
        <Notification type="error" header="Error">
          <p>Por favor, ingrese un correo válido.</p>
        </Notification>,
        { placement: "topEnd" }
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/forget-password", { email });
    
      toaster.push(
        <Notification type="success" header="Correo enviado">
          <p>
            Si el correo está registrado, se ha enviado un enlace de recuperación.
          </p>
        </Notification>,
        { placement: "topEnd" }
      );
    
      router.push("/login");
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error">
          <p>{error.response?.data?.error || "Ocurrió un error. Inténtelo más tarde."}</p>
        </Notification>,
        { placement: "topEnd" }
      );
    }

    setLoading(false);
  };

  return (
    <main className="w-screen h-screen flex">
      <section className="w-full p-14 flex flex-col justify-center items-center h-full gap-20 md:p-10 lg:p-28 lg:w-1/3">
        <div className="bg-[#880909] p-1">
          <img src="/logo.png" alt="Logo" className="w-36" />
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label>Correo</label>
            <Input
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (inputError) setInputError(false);
              }}
              style={{
                borderColor: inputError ? "red" : "",
              }}
            />
          </div>
          <Button
            style={styles}
            type="submit"
            color="red"
            appearance="primary"
            className="w-full"
            loading={loading}
          >
            Recuperar Contraseña
          </Button>
          <div className="w-full text-center">
            <a
              href="/login"
              className="text-blue-500 underline"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </section>
      <section className="hidden h-full justify-center items-center gap-10 bg-[#880909] text-white md:p-20 lg:flex lg:flex-col lg:w-2/3">
        <img src="/portatilmacbook.png" alt="mac" />
        <h2 className="w-2/3 text-center">
          Sistema de gestión de notas por resultados de aprendizaje
        </h2>
        <p className="w-1/3 text-center">
          Optimiza tu tiempo, mejora la comunicación y potencia el rendimiento
          académico. ¡Tu aliado perfecto en la educación moderna!
        </p>
        <span>
          UniversidadDelValle.com © 2002 - 2024 Reservados todos los derechos
        </span>
      </section>
    </main>
  );
}

const styles = {
  backgroundColor: "#c62120",
  color: "white",
  transition: "width 0.1s ease-in-out",
  fontWeight: "bold",
};
