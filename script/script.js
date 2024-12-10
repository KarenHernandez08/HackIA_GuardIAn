//Verificar URL
async function verificarURL() {
  const url = document.getElementById("url-input").value;
  const resultado = document.getElementById("resultado");
  resultado.textContent = "Consultando, por favor espera...";

  const apiKey = "96c6ac2229f6fa81b4729ebba261c4f68dd93788c34d8a94173a03cb0236147b"; // Coloca tu API Key aquí
  const base64Url = btoa(url).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"); // Convertir a base64 para VirusTotal
  const apiUrl = `https://www.virustotal.com/api/v3/urls/${base64Url}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-apikey": apiKey,
      },
    });

    if (response.status === 404) {
      resultado.innerHTML = `✅ Esta página parece ser SEGURA (No se encontró información específica en la API).`;
      return;
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // Extraer datos clave
    const stats = data.data.attributes.last_analysis_stats;

    // Determinar si es segura o maliciosa
    const esSegura = stats.malicious === 0 && stats.suspicious === 0;
    const mensaje = esSegura
      ? "✅ Esta página parece ser SEGURA."
      : "⚠️ Esta página puede ser MALICIOSA.";
      console.log(esSegura);
      console.log(mensaje);
    // Mostrar el resultado
    resultado.innerHTML = `${mensaje}`;
  } catch (error) {
    resultado.textContent = `Hubo un error: ${error.message}`;
  }
}


//Inicio
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll("#inicio .slide");
  const indicators = document.querySelectorAll("#indicators .indicator");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "hidden");
      if (i === index) {
        slide.classList.add("active");
      } else if (i < index) {
        slide.classList.add("hidden");
      }
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Cambiar slides automáticamente cada 6 segundos
  setInterval(nextSlide,6000);

  // Mostrar la slide seleccionada al hacer clic en un indicador
  indicators.forEach((indicator, i) => {
    indicator.addEventListener("click", () => {
      currentSlide = i;
      showSlide(currentSlide);
    });
  });

  // Mostrar la primera slide al cargar
  showSlide(currentSlide);
});

//Imagenes
// Variables para el lightbox y las imágenes
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeButton = document.getElementById("close-lightbox");
const galleryItems = document.querySelectorAll(".lightbox-trigger");

// Mostrar la imagen en el lightbox al hacer clic
galleryItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const src = item.getAttribute("src");
    lightboxImg.src = src; // Cargar la imagen a tamaño completo
    lightbox.classList.add("active");
  });
});

// Cerrar el lightbox al hacer clic en el botón de cierre
closeButton.addEventListener("click", () => {
  lightbox.classList.remove("active");
  });

// Cerrar el lightbox si el usuario hace clic fuera de la imagen
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("active");
  }
});


//Generador de contraseña segura
// Seleccionar elementos
const charCountSlider = document.getElementById("char-count");
const charCountDisplay = document.getElementById("char-count-display");
const generateBtn = document.getElementById("generate-btn");
const passwordDisplay = document.getElementById("password-display");

// Actualizar el número de caracteres dinámicamente
charCountSlider.addEventListener("input", () => {
  charCountDisplay.textContent = charCountSlider.value;
});

// Generar contraseña al hacer clic en el botón
generateBtn.addEventListener("click", () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const passwordLength = parseInt(charCountSlider.value, 10);
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  passwordDisplay.value = password;
});





// Simulador para generar un mensaje de phishing
const API_KEY = 'AIzaSyCzW6UMG55CdO6MNBerKXYBdJswo9vmLcQ';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY;

const mensajeDiv = document.getElementById("mensaje-generado");
let mensajeReal = ""; // Variable para almacenar el mensaje generado y saber si es phishing o no

document.getElementById("generar-btn").addEventListener("click", () => {
  const categoria = document.getElementById("categoria").value;
  
  // Hacer petición a Gemini para obtener el mensaje
  generarMensajeConGemini(categoria);
});

async function generarMensajeConGemini(categoria) {
  // Solicitar mensaje a Gemini
  const requestBody = {
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": `Genera un correo falso con datos de esta empres ficticia GuarDIAn
            de phishing para la categoría ${categoria}. Hazlo realista y añade detalles 
            como nombre de la empresa, enlaces sospechosos, etc. no coloques nota, y dale un formato bonito, considera
            saltos de línea`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Extraer el texto del correo generado por Gemini
    const mensajeGenerado = data.candidates[0].content.parts[0].text;
    
    mensajeReal = "phishing"; // Solo es phishing para este caso
    
    mensajeDiv.textContent = mensajeGenerado;  // Mostrar el mensaje generado

  } catch (error) {
    console.error("Error al generar el mensaje:", error);
    mensajeDiv.textContent = "Hubo un error al generar el mensaje. Inténtalo de nuevo.";
  }
}