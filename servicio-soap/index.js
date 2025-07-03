    // servicio-soap/index.js
    const express = require("express");
    const bodyParser = require("body-parser");

    const app = express();
    const PORT = 8080;

    app.use(bodyParser.text({ type: "text/xml" }));

    app.post("/soap", (req, res) => {
    const xml = req.body;
    console.log("📥 XML recibido:", xml);

    // Simulación: Si la cédula termina en un número par, tiene antecedentes
    let tieneAntecedentes = false;
    const match = xml.match(/<cedula>(.*?)<\/cedula>/);
    if (match && match[1]) {
        const cedula = match[1];
        const ultimoDigito = parseInt(cedula.slice(-1)); // Obtiene el último dígito como número
        if (!isNaN(ultimoDigito) && ultimoDigito % 2 === 0) {
            tieneAntecedentes = true; // Si el último dígito es par (0, 2, 4, 6, 8)
        }
    }


    const respuestaXML = `
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <verificarAntecedentesResponse>
            <estado>${tieneAntecedentes ? "Tiene antecedentes" : "Sin antecedentes"}</estado>
            </verificarAntecedentesResponse>
        </soap:Body>
        </soap:Envelope>
    `;

    res.set("Content-Type", "text/xml");
    res.send(respuestaXML);
    });

    app.listen(PORT, () => {
    console.log(`🟢 Servicio SOAP corriendo en http://localhost:${PORT}/soap`);
    });
//docker run -it --rm -e NGROK_AUTHTOKEN=2zKDLmjyY8BCs5uWJgz4Sf2CyzV_5H9p1XRdVRWsiyCJCm32F ngrok/ngrok http host.docker.internal:8080