"use client";
import React, { useState } from "react";
import { Button, Input, Checkbox, Notification, useToaster } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import PasswordInput from "../atoms/input/PasswordInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const toaster = useToaster();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (res?.ok) return router.push("/home/area-personal");
    if (res?.error) return setError(res.error);
    
  };

  return (
    <main className="w-screen h-screen flex">
      <section className="w-full p-14 flex flex-col justify-center items-center h-full gap-20 md:p-10 lg:p-28 lg:w-1/3 ">
        <div className="bg-[#880909] p-1">
          <img src="/logo.png" alt="Logo" className="w-36" />
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label>Correo</label>
            <Input value={email} onChange={(value) => setEmail(value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label>Contraseña</label>
            <PasswordInput value={password} onChange={setPassword} />
          </div>
          <Button
            style={styles}
            type="submit"
            color="red"
            appearance="primary"
            className="w-full"
            loading={loading}
          >
            Iniciar Sesión
          </Button>
          <div className="w-full flex justify-between items-center">
            <Checkbox
              checked={remember}
              onChange={(value) => setRemember(value)}
            >
              Recordar contraseña
            </Checkbox>
            <a href="#">¿Has olvidado tu contraseña?</a>
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
  backgroundColor: '#c62120',
  color: 'white',
  transition: 'width 0.1s ease-in-out',
  fontWeight: 'bold',
};