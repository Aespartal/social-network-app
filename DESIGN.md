# Design System: Aura

Este documento define la filosofía visual y la experiencia de usuario (UX) para 
distanciarnos de las redes sociales de microblogging tradicionales.

## 👁️ Filosofía de Diseño: "Intencionalidad sobre Inmediatez"

Buscamos que el usuario consuma contenido de valor, no que pierda el tiempo en 
un scroll infinito. El diseño debe fomentar la pausa y la reflexión.

---

## 🎨 Identidad Visual

### 1. Paleta de Colores (Propuesta "Forest Night")
*   **Primary:** `#2D5A27` (Verde Bosque - Transmite calma, no urgencia).
*   **Surface:** `#1A1A1B` (Negro mate profundo).
*   **Accent:** `#E0FF4F` (Lima Eléctrico - **Uso restringido:** Solo para CTA primarios y estados de foco para garantizar accesibilidad).
*   **Text:** `#F5F5F5` (Blanco roto para evitar la fatiga visual).
*   **Muted:** `rgba(245, 245, 245, 0.6)` (Para metadatos y texto secundario).

### 2. Tipografía
*   **Headlines:** *Montserrat Bold* (Moderna y con peso).
*   **Body:** *Lora* (Serifa) – **Decisión de diseño:** Usar serifa en el cuerpo del 
    mensaje hace que el texto se sienta como "lectura" y no como "ruido".

---

## 🛠️ Componentes Core (El "Anti-X")

### El "Feed" -> El "Mosaico"
*   No usaremos una columna central estrecha.
*   El contenido se despliega en un **Grid Masónico** (estilo Pinterest pero con 
    jerarquía de importancia).
*   Los posts con más interacción crecen físicamente en el grid, no solo suben arriba.

### Interacciones
*   **Sin Contador de Likes:** El "Like" es privado para el autor. El público solo 
    ve el "Impacto" (una métrica abstracta o visual, como un gradiente de color).
*   **Gestos:** Deslizar a la derecha para "Archivar" (leer luego), deslizar a la 
    izquierda para "Conectar" con otra idea.
*   **Métrica de Calidad:** En lugar de "Visto por X", usaremos "Tiempo de Atención" 
    acumulado, valorando el contenido que genera lectura real.

### Mecánica de "Slow Reading" (Innovación)
*   **Lectura Recompensada:** Si un usuario permanece en un post largo más de 15 segundos, el borde del post emite un leve brillo Lima (`#E0FF4F`) indicando que ha "absorbido" la idea, otorgando XP extra.

---

## 🗺️ Arquitectura de Información (Navegación)

1.  **Focus Mode (Home):** Solo muestra contenido de tus 5 intereses principales.
2.  **The Deep Dive (Explorar):** Mapa de nodos temáticos en lugar de una lista de hashtags.
3.  **The Archive (Perfil):** Organizado por colecciones o temas, no por orden cronológico estricto.

---

## 🕹️ Micro-interacciones
*   **Haptic Feedback:** Vibraciones sutiles al "conectar" ideas.
*   **Transiciones:** Desvanecimientos suaves entre pantallas para reducir la sensación de "salto" constante de la información.
*   **Texturas Biofílicas:** El fondo (`Surface`) no será un color plano; tendrá un sutil grano orgánico para imitar la textura del papel o la piedra, reduciendo la frialdad digital.
*   **Enfoque Dinámico:** Al hacer scroll, los posts que no están en el centro se desenfocan sutilmente (`blur`), guiando el ojo del usuario a una sola idea a la vez.