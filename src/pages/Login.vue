<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center bg-grey-2">
                <q-card class="q-pa-md shadow-2 my_card" bordered>
                    <q-form @submit="login" class="q-gutter-md">
                        <q-card-section class="text-center">
                            <div class="text-grey-9 text-h5 text-weight-bold">Cepreuna Music</div>
                            <div class="text-grey-8">Sign in music cepreuna paylist 🎹</div>
                            <q-img src="~assets/img/logo.png" />
                        </q-card-section>
                        <q-card-section>
                            <q-input dense outlined v-model="email" type="text" label="Usuario"></q-input>
                            <q-input dense outlined class="q-mt-md" v-model="password" type="password"
                                label="Contraseña"></q-input>
                        </q-card-section>
                        <q-card-section>
                            <q-btn style="border-radius: 8px;" color="primary" rounded size="md" label="Sign in" no-caps
                                class="full-width" type="submit"></q-btn>
                            <q-btn style="border-radius: 8px;" color="red" rounded size="md" label="Google" no-caps
                                class="q-mt-xs full-width" type="button" @click="authGoogle()">
                                <q-icon class="q-ml-xs" left size="1em" name="fab fa-google" />
                            </q-btn>
                        </q-card-section>
                        <q-card-section class="text-center q-pt-none">
                            <div class="text-grey-8">Don't have an account yet?
                                <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">
                                    <span class="text-red-9">Signup.</span>
                                </a>
                            </div>
                        </q-card-section>
                    </q-form>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import AuthServices from "src/auth-module/AuthServices.js";
import { QSpinnerGears } from 'quasar'
//import Transition from "@/components/Transition.vue";

export default defineComponent({
    name: 'Login',
    setup() {
        return {
            email: "antony123@mail.com",
            password: "123456789",
        }
    },
    methods: {
        async login() {
            const dismiss = this.$q.notify({
                spinner: QSpinnerGears,
                message: '<p>Esperando al Servidor &nbsp;<span><i class="fa fa-server" aria-hidden="true"></i> <span> <p>',
                timeout: 0, // Establecer el timeout a 0 para que la notificación no se cierre automáticamente
                html: true
            });

            await AuthServices.login(this.email, this.password)
                .then(async () => {
                    dismiss()
                    this.registrar();
                },
                    (error) => {
                        dismiss()
                        this.showNotif(error.response.data[0].message)
                    }
                )
                .catch((error) => {
                    dismiss();
                    this.showNotif(error);
                })
        },
        async authGoogle() {
            try {
                // Abre una nueva ventana emergente para la autenticación con Google
                const authWindow = window.open('http://localhost:3333/login/google');

                if (!authWindow) {
                    throw new Error('No se pudo abrir la ventana de autenticación. Verifica que los pop-ups no estén bloqueados.');
                }

                // Verifica si la ventana emergente se cierra cada cierto intervalo de tiempo
                const checkPopupClosed = new Promise((resolve, reject) => {
                    const timer = setInterval(() => {
                        if (authWindow.closed) {
                            clearInterval(timer); // Detiene la verificación del intervalo de tiempo
                            resolve();
                        }
                    }, 1000);
                });

                // Espera a que se cierre la ventana emergente
                await checkPopupClosed;

                // Escucha mensajes desde la ventana emergente
                window.addEventListener('message', async (event) => {
                    if (event.origin !== 'http://localhost:3333') {
                        return; // Ignora los mensajes de orígenes no confiables
                    }

                    // Verifica si el mensaje contiene datos de usuario y token
                    const userData = event.data;
                    console.log(userData);
                    if (userData && userData.token) {
                        // Cierra la ventana emergente
                        authWindow.close();

                        // Guarda el token en el almacenamiento local, por ejemplo
                        localStorage.setItem('token', userData.token);

                        // Llama a una función para registrar al usuario con la información recibida
                        await this.registrar(); // Ajusta esta función para recibir el usuario como parámetro si es necesario

                        // Redirige al usuario a la página de inicio o realiza otras acciones necesarias
                        window.location.href = '/'; // Reemplaza '/' con la URL a la que deseas redirigir al usuario
                    } else {
                        // Muestra una notificación de error si no se recibió el token
                        this.showNotif('Error al obtener el token de autenticación.');
                    }
                });

            } catch (error) {
                // Muestra una notificación de error si ocurre algún problema durante la autenticación
                this.showNotif(`Error de autenticación: ${error.message}`);
            }
        },

        async registrar() {
            await this.$store.dispatch("app/login");
            this.$router.push("/");
        },
        showNotif(message) {
            this.$q.notify({
                position: 'top-right',
                message: message,
                color: 'negative',
                icon: 'report_problem'
            })
        },
    }
})
</script>

<style scoped>
.my_card {
    width: 23rem;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>