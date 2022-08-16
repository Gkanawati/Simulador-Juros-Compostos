
const formPost = document.querySelector("#formPost");
const request = document.querySelector("#request");

const url = 'http://api.mathjs.org/v4/';

formPost.onsubmit = function (event) {
    event.preventDefault()

    let hasError = false;

    const inputName = document.forms['formPost']['inputName']

    if (!inputName.value) {
        hasError = true;
        inputName.classList.add('inputError')

        // pegando o proximo irmao
        let span = inputName.nextSibling.nextSibling
        span.innerHTML = 'Digite o nome corretamente';
    }
    else {
        inputName.classList.remove('inputError')
        let span = inputName.nextSibling.nextSibling
        span.innerHTML = '';
    }

    const inputMonth = document.forms['formPost']['inputMonth']
    const numberMont = parseFloat(inputMonth.value.replace(',', '.'));

    const valueConvert = numberMont.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    if (inputMonth.value != '')
        inputMonth.value = valueConvert;

    if (!inputMonth.value) {
        hasError = true;
        inputMonth.classList.add('inputError')

        // pegando o proximo irmao
        let span = inputMonth.nextSibling.nextSibling
        span.innerHTML = 'Digite corretamente';
    }
    else {
        inputMonth.classList.remove('inputError')
        let span = inputMonth.nextSibling.nextSibling
        span.innerHTML = '';
    }

    const inputJuros = document.forms['formPost']['inputJuros']
    const percentToNumber = parseFloat(inputJuros.value.replace(',', '.'))

    console.log(percentToNumber)
    console.log(percentToNumber / 100)

    const validation = /[^\d,]+/g

    if (!inputJuros.value && inputJuros.value.match(validation)) {
        hasError = true;
        inputJuros.classList.add('inputError')

        // pegando o proximo irmao
        let span = inputJuros.nextSibling.nextSibling
        span.innerHTML = 'Digite um número válido e sem %';
    }
    else {
        inputJuros.classList.remove('inputError')
        let span = inputJuros.nextSibling.nextSibling
        span.innerHTML = '';
    }

    const inputTime = document.forms['formPost']['inputTime']
    const timeValue = inputTime.value

    if (!inputTime.value) {
        hasError = true;
        inputTime.classList.add('inputError')

        // pegando o proximo irmao
        let span = inputTime.nextSibling.nextSibling
        span.innerHTML = 'Digite corretamente';
    }
    else {
        inputTime.classList.remove('inputError')
        let span = inputTime.nextSibling.nextSibling
        span.innerHTML = '';
    }

    if (!hasError) {
        const configs = {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: `{ "expr": "${numberMont} * (((1 + ${percentToNumber / 100}) ^ ${timeValue} - 1) / ${percentToNumber / 100})" }`,
        }

        fetch(url, configs).then(transformIntoJson).then(calculateSimulation).catch(error => console.log("Erro: ", error))

        function calculateSimulation(data) {
            console.log(data)
            console.log(data.result)

            const respConvert = parseFloat(data.result.replace(',', '.')).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

            formPost.classList.add("hidden")

            request.innerHTML = `
                <span>
                    Ola ${inputName.value}, investindo ${valueConvert} todo mês, você terá ${respConvert} em ${timeValue} meses
                </span>
                <a id="newSimulation">
                    Simular Novamente
                </a>
                <img src="./assets/loading.gif" alt="" width="40" id="loadingGif" class="hidden">
            `;
            request.classList.remove("hidden")

            const loadingGif = document.querySelector("#loadingGif")
            const btnNewSimulation = document.querySelector('#newSimulation');

            btnNewSimulation.addEventListener("click", function () {
                btnNewSimulation.classList.add("hidden")
                loadingGif.classList.remove("hidden")

                inputName.value = '';
                inputMonth.value = '';
                inputJuros.value = '';
                inputTime.value = '';

                setTimeout(() => {
                    request.classList.add("hidden")
                    formPost.classList.remove("hidden")
                }, 1000)
            })
        }
    }
}

function transformIntoJson(response) {
    return response.json()
}