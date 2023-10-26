
const CapturarFala = () => {
    let botao = document.querySelector('#microfone');
    let input = document.querySelector('input');

    const OpenAPIKey  = process.env.OPENAI_API_KEY;
    const AzureAPIKey = process.env.AZURE_API_KEY;

    var recognition = new webkitSpeechRecognition();
    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    botao.addEventListener('mousedown', () => {
        recognition.start();
    });

    botao.addEventListener('mouseup', () => {
        recognition.stop();
        PerguntarAoJarvis(input.value);
    });

    recognition.addEventListener('result', (e) => {
        const result = e.results[0][0].transcript;
        input.value = result;
    });

}

const PerguntarAoJarvis = async (pergunta) => {

    let textus = pergunta.toUpperCase();
    //console.log(data.choices[0].message.content);

    if(textus.includes('JARVIS')){

    }

    let url='https:/api.openai.com/v1/chat/completions';

    let header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPIKey}`
    }

    let body = {
        "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8DDHyrh4",
        "messages": [
          {
            "role": "system",
            "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas"
          },
          {
            "role": "user",
            "content": pergunta
          }
        ],
        "temperature": 0.7      
    }

    let options = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
    }

    fetch(url, options)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data.choices[0].message.content);
        FalarComoJarvis(data.choices[0].message.content);
    });
}


const FalarComoJarvis = (texto) => {
    const endpoint  = 'https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1';
    const textoParaFala = texto;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': AzureAPIKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'curl',
        },
        body: `<speak version='1.0' xml:lang='pt-BR'>
                <voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-AntonioNeural'>
                 ${textoParaFala}
                </voice>
            </speak>`,
    };

    fetch(endpoint, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.arrayBuffer();
            } else {
                throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
            }
        })
        .then(data => {
            const blob = new Blob([data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);

            const audioElement = new Audio(audioUrl);
            audioElement.play();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

CapturarFala();

