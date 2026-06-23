# Contexto del Proyecto: GourmetDev

## Descripción General
[cite_start]Desarrollar una aplicación de recetas de cocina utilizando **Next.js (App Router)**, implementando autenticación de usuarios, integración con base de datos **MongoDB (Mongoose)** y envío de correos electrónicos automáticos[cite: 4, 28].

---

## Arquitectura del Proyecto (`src/`)
[cite_start]El proyecto sigue un patrón de **Arquitectura por Capas** estricto, limpio, sin uso de malas prácticas (`any`, `var`), tipado estricto y desacoplado[cite: 24, 25, 44, 47]:

* [cite_start]`src/core/interfaces/`: Contratos de dominio, interfaces de entidades y definiciones de tipos TypeScript[cite: 44, 47].
* `src/lib/`: Capa de infraestructura. [cite_start]Conexión única (Singleton) a MongoDB y definición de modelos de Mongoose[cite: 27, 28, 45].
* `src/services/`: Capa de aplicación (Service Layer). Contiene toda la lógica de negocio. [cite_start]Toda interacción con los modelos de la base de datos debe orquestarse aquí[cite: 25, 26, 44].
* [cite_start]`src/app/api/`: Controladores HTTP (Route Handlers) encargados de recibir peticiones, delegar a los servicios y manejar errores tipados con `unknown`[cite: 25, 44].
* [cite_start]`src/components/`: Componentes de UI puros, modulares y reutilizables (estilo HeroUI/MUI)[cite: 8, 30, 31, 32, 41].

---

## Requisitos de Base de Datos (MongoDB)
[cite_start]Colecciones estructuradas bajo `src/lib/models/`[cite: 28, 29]:
1.  [cite_start]**`users`**: Información de usuarios registrados (Sugerido: id, name, email, password)[cite: 29].
2.  [cite_start]**`recipes`**: Catálogo de recetas que incluye campos planos y extendidos[cite: 29].
3.  [cite_start]**`favorites`**: Relación de recetas favoritas por usuario[cite: 29].

---

## 🛠️ Requisitos Funcionales y Enrutamiento

### Tabla de Rutas y Accesos
| Ruta | Descripción | Auth Requerida | Capa UI / API correspondientes |
| :--- | :--- | :--- | :--- |
| `/` | [cite_start]Catálogo general de recetas[cite: 7, 37]. [cite_start]Componente `RecipeCard` con props (imagen, nombre, tiempo, dificultad)[cite: 8, 9]. | [cite_start]**No** [cite: 10, 37] | [cite_start]`src/app/page.tsx` + `src/components/RecipeCard.tsx` [cite: 8, 41] |
| `/recipes/[id]` | Ruta dinámica. [cite_start]Detalle completo de la receta (ingredientes, pasos, porciones)[cite: 12, 13, 37]. | [cite_start]**No** [cite: 37] | [cite_start]`src/app/recipes/[id]/page.tsx` [cite: 12, 42] |
| `/login` | [cite_start]Página de inicio de sesión[cite: 15, 37]. | [cite_start]**No** [cite: 37] | [cite_start]`src/app/login/page.tsx` [cite: 15] |
| `/register` | [cite_start]Formulario de registro de usuario[cite: 15, 39]. [cite_start]Dispara evento de integración[cite: 35]. | [cite_start]**No** [cite: 39] | [cite_start]`src/app/register/page.tsx` [cite: 15] |
| `/favorites` | [cite_start]Listado exclusivo de recetas marcadas por el usuario logueado[cite: 19, 21, 39]. | [cite_start]**Sí** [cite: 22, 39] | [cite_start]`src/app/favorites/page.tsx` [cite: 21] |

### Reglas de Negocio Clave
1.  [cite_start]**Autenticación**: Los usuarios no autenticados pueden navegar por el catálogo y ver detalles, pero el icono de marcador para guardar favoritos requiere sesión activa[cite: 10, 16, 19].
2.  [cite_start]**Navbar Dinámico**: Al estar autenticado, el Navbar superior debe reflejar de forma reactiva el nombre del usuario logueado[cite: 17, 43].
3.  [cite_start]**Integración de Servicios**: Al registrar exitosamente un usuario en la capa de servicios, se debe invocar de forma asíncrona un servicio de mensajería para enviar un **correo electrónico de bienvenida**[cite: 34, 35, 46].

---

## Criterios de Evaluación Senior
* [cite_start]Componentización limpia y pasaje estricto de props inmutables (`readonly`)[cite: 8, 41, 47].
* [cite_start]Manejo correcto de rutas dinámicas de Next.js[cite: 12, 42].
* [cite_start]Protección de rutas de favoritos y estado de sesión en Layouts globales[cite: 22, 43].
* [cite_start]Estructura de inyección de dependencias o separación rígida en la capa de servicios[cite: 25, 44].
* [cite_start]Manejo seguro de conexiones a bases de datos y control de errores sin fugas de información[cite: 27, 45, 47].