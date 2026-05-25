# Alba English

Sitio web estático de Alba English Academy Online.

## Estructura

```
alba-english/
├── index.html
├── book-lesson.html
├── login.html
├── signup.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
└── README.md
```

Todas las páginas comparten un único CSS (`css/styles.css`) y un único JavaScript (`js/script.js`).

## Despliegue en Netlify

Arrastra la carpeta `alba-english/` al panel de Netlify, o conecta el repositorio. No hace falta paso de build: el sitio es 100% estático.

## Desarrollo local

Cualquier servidor estático sirve. Por ejemplo:

```
cd alba-english
python3 -m http.server 8000
```

Y abre `http://127.0.0.1:8000/`.

## Notas

- `login.html` y `signup.html` llevan `class="page-auth"` en el `<body>`. Esa clase es la que activa los estilos específicos de esas páginas (navbar opaco sobre fondo claro, panel lateral con slideshow, layout de formulario centrado).
- Los formularios envían vía FormSubmit a `info@albaenglish.academy`.
- El calendario de `book-lesson.html` calcula las semanas dinámicamente desde la fecha actual del navegador.
