# QA Automation with Cypress -- OpenCart

Proyecto de automatización de pruebas sobre **OpenCart 4.1.0.3**,
desarrollado con **Cypress y JavaScript**. Incluye pruebas de interfaz
(UI), pruebas API, escenarios E2E y BDD con Gherkin/Cucumber, además de
un entorno Docker y una integración continua con GitHub Actions.

Repositorio:
[f36fll0/qa-automation-cypress](https://github.com/f36fll0/qa-automation-cypress)\
Rama de trabajo: `clean-code`

------------------------------------------------------------------------

## 1. Objetivos del proyecto

El objetivo es aplicar técnicas de QA Automation sobre una aplicación
web real, organizando las pruebas para facilitar su mantenimiento y
reutilización.

El proyecto cubre:

-   Automatización de funcionalidades de usuario mediante Cypress.
-   Organización de pruebas con **Page Object Model (POM)**.
-   Gestión de datos de prueba mediante fixtures.
-   Reutilización de operaciones con helpers y custom commands.
-   Pruebas de API mediante `cy.request()`.
-   Escenarios BDD mediante Gherkin y Cucumber.
-   Ejecución headless de la suite.
-   Integración continua con GitHub Actions y Docker.
-   Restauración de una copia de la base de datos de OpenCart para
    disponer de datos de prueba en CI.

## 2. Tecnologías

  Tecnología                Uso
  ------------------------- ----------------------------------------------
  JavaScript                Lenguaje de automatización
  Cypress 15.18.0           Framework de pruebas
  OpenCart 4.1.0.3          Aplicación bajo prueba
  Docker / Docker Compose   Entorno de ejecución de OpenCart y MySQL
  MySQL 8.0                 Base de datos
  Node.js 22                Entorno utilizado por GitHub Actions
  Gherkin / Cucumber        Especificación y ejecución de escenarios BDD
  Git / GitHub              Control de versiones
  GitHub Actions            Integración continua

## 3. Arquitectura y entorno

La aplicación OpenCart y el proyecto de automatización se mantienen
separados.

-   **OpenCart** se ejecuta en un contenedor PHP/Apache.
-   **MySQL** se ejecuta en un contenedor independiente.
-   **Cypress** se ejecuta desde el proyecto de automatización y accede
    a OpenCart a través de `http://localhost`.
-   Docker Compose define los servicios necesarios para levantar la
    aplicación.

En el entorno local utilizado durante el desarrollo, la instalación de
OpenCart se encuentra en una carpeta hermana del proyecto Cypress. El
volumen de Docker Compose monta `../opencart/upload` en `/var/www/html`
dentro del contenedor.

### Servicios Docker

  Servicio     Función
  ------------ -----------------------
  `opencart`   Aplicación PHP/Apache
  `mysql`      Servidor MySQL 8.0

La configuración de Docker se encuentra en:

-   `docker/docker-compose.yml`
-   `docker/Dockerfile`

## 4. Organización del proyecto

La estructura se ha organizado separando los tests, los datos, los Page
Objects y el soporte de Cypress. La estructura lógica principal es:

``` text
qa-automation-cypress/
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress/
│   ├── api/
│   ├── ui/
│   ├── e2e/
│   ├── fixtures/
│   ├── pages/
│   ├── step_definitions/
│   └── support/
│       ├── helpers/
│       ├── commands.js
│       └── e2e.js
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

La ubicación concreta de algunos archivos puede variar según la
configuración final de `cypress.config.js` y del preprocesador Cucumber.

## 5. Estrategia de automatización

### 5.1 Page Object Model

Se utiliza POM para separar los localizadores y las acciones de cada
página de los propios casos de prueba. De esta forma se reduce la
duplicación y se centraliza el mantenimiento de selectores y
comportamientos.

Entre los Page Objects desarrollados se encuentran:

-   `RegisterPage` y `LoginPage`
-   `AccountPage` y `HeaderPage`
-   `ProductCategoryPage`
-   `MyWishListPage`
-   `ShoppingCartPage`
-   `CheckoutPage`
-   `OrderHistoryPage` y `OrderInfoPage`
-   `EditAccountPage`
-   `ChangePasswordPage`
-   `AddAddressBookPage` y `AddressBookEntriesPage`

### 5.2 Fixtures

Los fixtures contienen datos reutilizables para evitar introducir datos
de prueba directamente en cada test.

Se utilizan, entre otros, datos de usuario y direcciones. Para evitar
colisiones al registrar usuarios, se han generado direcciones de correo
únicas utilizando `Date.now()`.

### 5.3 Helpers y custom commands

Las operaciones repetidas se encapsulan en helpers y comandos
personalizados. Por ejemplo, se dispone de un helper para añadir
productos al carrito, reutilizable desde diferentes escenarios.

## 6. Cobertura funcional

La suite incluye pruebas sobre los principales módulos de OpenCart.

  -----------------------------------------------------------------------
  Área                                Funcionalidad cubierta
  ----------------------------------- -----------------------------------
  Registro                            Registro correcto, usuario
                                      existente, email inválido, campos
                                      obligatorios y validaciones de
                                      longitud

  Login                               Inicio de sesión y validación del
                                      acceso

  My Account                          Acceso y navegación por el área de
                                      usuario

  Catálogo                            Categorías, productos, información
                                      y acciones sobre productos

  Wishlist                            Añadir, consultar y eliminar
                                      productos

  Shopping Cart                       Añadir productos, consultar
                                      contenido, cantidad y precio,
                                      actualizar y eliminar

  Checkout UI / E2E                   Interacciones del proceso de compra
                                      y escenarios de checkout

  Address Book                        Alta y consulta de direcciones

  Edit Account                        Modificación de datos de usuario

  Change Password                     Cambio de contraseña

  Order History                       Consulta del historial y detalle de
                                      pedidos
  -----------------------------------------------------------------------

El inventario anterior describe las áreas trabajadas; no implica que
todos los casos posibles de cada módulo estén automatizados.

## 7. API Testing

Las pruebas API se realizan con `cy.request()` contra las rutas de
controlador de OpenCart (`index.php?route=...`).

El trabajo incluye el análisis de las peticiones HTTP, parámetros POST,
respuestas JSON, cookies y sesión. Se investigó el comportamiento de
OpenCart desde los formularios Twig y JavaScript/AJAX hasta los
controladores PHP y los modelos.

El flujo API de checkout implementado cubre:

1.  Obtener la página de login y extraer el `login_token`.
2.  Iniciar sesión.
3.  Añadir un producto al carrito.
4.  Guardar la dirección de envío.
5.  Consultar los métodos de envío.
6.  Guardar el método de envío.
7.  Consultar los métodos de pago.
8.  Guardar el método de pago.
9.  Aceptar las condiciones.

**Alcance:** este flujo llega a la selección de envío y pago y a la
aceptación de condiciones. No debe describirse como una creación y
confirmación completa del pedido si esa operación no se ha implementado
y verificado.

## 8. BDD con Gherkin y Cucumber

Se ha integrado Cucumber para expresar escenarios mediante archivos
`.feature` y vincularlos con step definitions en JavaScript.

Esta capa permite describir los flujos con un lenguaje cercano al
comportamiento funcional y reutilizar Page Objects y operaciones
existentes.

La configuración de Cypress contempla la ejecución de las pruebas UI y
de los escenarios BDD.

## 9. Requisitos previos

Para ejecutar el proyecto se necesita:

-   Node.js y npm.
-   Docker Desktop con Docker Compose.
-   Git.
-   Una instalación de OpenCart compatible con la configuración del
    proyecto.

En el entorno local de desarrollo, OpenCart se encuentra en la carpeta
hermana `opencart`, porque el `docker-compose.yml` monta
`../opencart/upload`.

## 10. Instalación y ejecución local

### 10.1 Obtener el proyecto

``` bash
git clone https://github.com/f36fll0/qa-automation-cypress.git
cd qa-automation-cypress
```

Si se trabaja con la rama utilizada durante el desarrollo:

``` bash
git checkout clean-code
```

### 10.2 Instalar dependencias

``` bash
npm ci
```

`npm ci` instala las dependencias definidas en `package-lock.json` y es
el comando utilizado también en CI.

### 10.3 Preparar OpenCart y Docker

Comprueba que la instalación de OpenCart está disponible en la ruta
esperada por el volumen de `docker/docker-compose.yml`
(`../opencart/upload`) y que sus archivos de configuración contienen los
parámetros adecuados para el entorno local.

Desde la raíz del proyecto, levanta los servicios:

``` bash
docker compose -f docker/docker-compose.yml up -d --build
```

Comprueba el estado de los contenedores:

``` bash
docker compose -f docker/docker-compose.yml ps
```

La URL local utilizada por Cypress es:

``` text
http://localhost
```

### 10.4 Abrir Cypress en modo interactivo

``` bash
npx cypress open
```

### 10.5 Ejecutar Cypress en modo headless

``` bash
npx cypress run
```

Este es el comando empleado por GitHub Actions para ejecutar la suite
automáticamente.

### 10.6 Detener el entorno Docker

``` bash
docker compose -f docker/docker-compose.yml down
```

En CI se utiliza `down -v` para eliminar también los volúmenes
temporales al finalizar el job.

## 11. Integración continua con GitHub Actions

El workflow se encuentra en:

``` text
.github/workflows/cypress.yml
```

Se ejecuta ante:

-   `push` a la rama `clean-code`.
-   `pull_request` dirigido a `clean-code`.
-   Ejecución manual mediante `workflow_dispatch`.

### 11.1 Secuencia del pipeline

1.  Descarga el repositorio del proyecto.
2.  Descarga OpenCart 4.1.0.3.
3.  Descarga el backup de base de datos desde un repositorio privado.
4.  Configura Node.js 22.
5.  Instala las dependencias mediante `npm ci`.
6.  Genera los archivos `config.php` de catálogo y administración para
    CI.
7.  Arranca MySQL y espera a que esté disponible.
8.  Descomprime e importa la base de datos.
9.  Elimina el instalador de OpenCart.
10. Arranca OpenCart y espera a que responda por HTTP.
11. Ejecuta `npx cypress run`.
12. Muestra los logs de Docker si se produce un error y detiene los
    contenedores.

### 11.2 Backup privado de la base de datos

La base de datos utilizada en CI procede de una exportación del entorno
local. El archivo comprimido `opencart.sql.gz` se almacena en un
repositorio privado independiente:

``` text
f36fll0/opencart.sql.gz
```

El workflow accede a ese repositorio mediante un Fine-grained Personal
Access Token almacenado como secreto del repositorio público:

``` text
OPENCART_DB_TOKEN
```

El token debe tener acceso únicamente al repositorio privado y permisos
de lectura (`Contents: Read-only` y `Metadata: Read-only`). Nunca se
debe incluir su valor directamente en el código.

El archivo se descarga en la carpeta `db-backup` y se importa en el
servicio MySQL de CI. La importación utiliza `--binary-mode=1` en el
cliente MySQL para permitir el tratamiento de caracteres nulos presentes
en el flujo SQL.

### 11.3 Datos y seguridad

El backup no se almacena en el repositorio público. Las reglas de
`.gitignore` excluyen los archivos SQL, el comprimido y los archivos
auxiliares utilizados durante la preparación:

``` gitignore
opencart.sql
opencart.sql.gz
opencart_base64.txt
opencart_part_*.txt
```

El repositorio privado debe mantenerse privado y el backup debe contener
datos de prueba, no datos personales reales ni credenciales de
producción.

### 11.4 Validación del pipeline

Una ejecución solo se considera satisfactoria cuando se completan
correctamente la descarga del backup, la restauración de MySQL, el
arranque de OpenCart y la ejecución de Cypress.

El estado de GitHub Actions se consulta en la pestaña **Actions** del
repositorio.

## 12. Resultados de ejecución

En una ejecución local headless del **19 de noviembre de 2026**, la
suite obtuvo:

  Resultado     Tests
  ----------- -------
  Passing          68
  Pending           1
  Failing           0
  Total            69

Este resultado corresponde a la ejecución local y no garantiza que CI
obtenga exactamente el mismo resultado. El resultado de GitHub Actions
debe consultarse en cada ejecución del workflow.

## 13. Buenas prácticas aplicadas

-   Separación entre la aplicación bajo prueba y el proyecto de
    automatización.
-   Page Objects para centralizar selectores y acciones.
-   Fixtures para gestionar datos de prueba.
-   Helpers y custom commands para reutilizar operaciones.
-   Uso de `cy.request()` para pruebas API.
-   Reutilización de la sesión entre peticiones del flujo API.
-   Ejecución headless para integración continua.
-   Entorno de CI efímero mediante Docker Compose.
-   Uso de secretos de GitHub para credenciales de acceso a repositorios
    privados.
-   Exclusión de backups y archivos auxiliares mediante `.gitignore`.

## 14. Posibles mejoras futuras

Las siguientes ideas pueden considerarse ampliaciones, no
funcionalidades que deban darse por implementadas:

-   Ampliar escenarios negativos de API.
-   Revisar la gestión y limpieza de datos creados por los tests.
-   Ampliar el flujo API hasta la creación y confirmación final del
    pedido.
-   Publicar artefactos de resultados, vídeos o capturas de Cypress
    cuando sea útil.
-   Ampliar la matriz de navegadores o entornos de ejecución.

------------------------------------------------------------------------

## Autoría y propósito

Proyecto personal de portfolio orientado a demostrar conocimientos
prácticos de QA Automation con Cypress y JavaScript, automatización
UI/API, diseño mantenible de pruebas, análisis de aplicaciones web y
configuración de integración continua.
