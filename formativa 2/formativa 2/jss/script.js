
var dados_pizza = [
    ['categoria', 'total'],
    ['0', 0]
];

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGraficoDePizza);

function desenharGraficoDePizza() {

    let data = google.visualization.arrayToDataTable(dados_pizza);

    let options = {
        title: 'Totais de casos de COVID-19 em todo o mundo: ',
        is3D: true,
        legend: { position: 'bottom' }
    };

    let chart = new google.visualization.PieChart(
        document.getElementById('grafico-casos')
    );

    chart.draw(data, options);
}
async function carregarDados() {

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDados(dados))
        .catch(e => exibirDados(e.mensagem));
}

function prepararDados(dados) {
    var totalC = 0
    var totalD = 0
    var totalR = 0

    for (let i = 0; i < dados['data'].length; i++) {

        totalC = totalC + dados['data'][i].confirmed
        totalD = totalD + dados['data'][i].deaths
        totalR = totalR + dados['data'][i].recovered

    }

    dados_pizza = [
        ['categoria', 'total']
    ];

    dados_pizza.push(['Confirmados', totalC]);
    dados_pizza.push(['Mortes', totalD]);
    dados_pizza.push(['Recuperados', totalR]);

    desenharGraficoDePizza();
}

/////////////////////////////////////////////////////////
//mapa//
/////////////////////////////////////////////////////////
var dados_mapa = [
    ['País', 'Casos'],
    ['0', 0]
];


google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharmapa);

function desenharmapa() {
    var data = google.visualization.arrayToDataTable(
        dados_mapa
    );

    let options = {
        colorAxis: { colors: ['lightskyblue', 'blue'] }
    };

    var chart = new google.visualization.GeoChart(document.getElementById('casos-mundo-total'));

    chart.draw(data, options);
}
async function carregarDadosMapa() {

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDadosMapa(dados))
        .catch(e => exibirDadosMapa(e.mensagem));
}

function prepararDadosMapa(dados) {

    dados_mapa = [
        ['País', 'Casos']
    ];

    for (let i = 0; i < dados['data'].length; i++) {

        dados_mapa.push([dados['data'][i].country, dados['data'][i].confirmed])

    }

    console.table(dados_mapa)



    desenharmapa();
}

/////////////////////////////////////
//tabela//
////////////////////////////////////
async function carregarTabela() {

    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')
        .then(response => response.json())
        .then(dados => prepararDadosTabela(dados))
        .catch(e => exibirErro(e.message));
}

function prepararDadosTabela(dados) {
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';


    for (let i = 0; i < dados['data'].length; i++) {
        let auxLinha = '';

        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        auxLinha += '<td class="linhas">' + dados['data'][i].uf + '</td>' +
            '<td class="linhas">' + dados['data'][i].state + '</td>' +
            '<td class="linhas">' + dados['data'][i].cases + '</td>' +
            '<td class="linhas, sumir">' + dados['data'][i].deaths + '</td>' +
            '<td class="linhas, sumir">' + dados['data'][i].suspects + '</td>' +
            '<td class="linhas, sumir">' + dados['data'][i].refuses + '</td>' +
            '</tr>';

        linhas.innerHTML += auxLinha;
    }
}

document.addEventListener("DOMContentLoaded",
    function (event) {
        carregarDados();
        carregarDadosMapa();
        carregarTabela();
    })